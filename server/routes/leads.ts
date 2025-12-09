import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../trpc.js'
import { searchLeads } from '../services/apify.js'
import { checkCache, saveToCache, getCacheStats } from '../services/cache.js'
import { enrichLead, bulkEnrichLeads } from '../services/enrichment.js'
import { calculateLeadScore, getLeadCategory, calculateOpportunityValue } from '../services/scoring.js'
import { searchHighIntentBusinesses, getServiceTypes, getUSStates } from '../services/highIntentSearch.js'

// Simple XSS sanitization - remove script tags and dangerous attributes
function sanitizeText(text: string): string {
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/javascript:/gi, '')
    .trim()
}

// In-memory storage for development (will use database in production)
interface StoredLead {
  id: string
  userId: string // Added for user isolation
  businessName: string
  category: string
  address?: string
  city: string
  state: string
  phone?: string
  email?: string
  website?: string
  instagram?: string
  facebook?: string
  linkedin?: string
  twitter?: string
  googleRating?: number
  reviewCount?: number
  stage: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
  notes: string[]
  tags: string[]
  activities: Activity[]
  nextFollowUpAt?: string
  lastContactedAt?: string
  lastContactMethod?: string
  createdAt: string
  updatedAt: string
}

interface Activity {
  id: string
  type: 'contacted' | 'note_added' | 'stage_changed' | 'tag_added' | 'follow_up_scheduled'
  contactMethod?: string
  details: string
  createdAt: string
}

const pipelineLeads = new Map<string, StoredLead>()

export const leadsRouter = router({
  // Search for leads using Google Maps
  // Now searches the entire region with contact & social enrichment built-in
  search: publicProcedure
    .input(
      z.object({
        category: z.string().min(1),
        location: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const { category, location } = input

      console.log('[Search] Starting search for:', category, 'in', location)

      // Check cache first (now async with database)
      const cached = await checkCache(category, location)
      if (cached) {
        console.log('[Search] Cache hit! Found', cached.leads.length, 'leads')
        return {
          leads: cached.leads,
          count: cached.leads.length,
          cached: true,
        }
      }

      console.log('[Search] Cache miss, searching via Apify...')

      // Search using Apify - no limits, full region search with enrichment
      const leads = await searchLeads({
        searchQuery: `${category} in ${location}`,
      })

      console.log('[Search] Found', leads.length, 'leads from Apify')

      // Save to cache (now async with database)
      await saveToCache(category, location, leads)

      return {
        leads,
        count: leads.length,
        cached: false,
      }
    }),

  // Get cache statistics
  getCacheStats: publicProcedure.query(async () => {
    return await getCacheStats()
  }),

  // Get a single lead by ID (requires authentication)
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      const lead = pipelineLeads.get(input.id)
      // Only return lead if it belongs to the authenticated user
      if (!lead || lead.userId !== ctx.userId) {
        return null
      }
      return lead
    }),

  // Add lead to pipeline (requires authentication)
  addToPipeline: protectedProcedure
    .input(
      z.object({
        lead: z.object({
          businessName: z.string(),
          category: z.string(),
          address: z.string().optional(),
          city: z.string(),
          state: z.string(),
          phone: z.string().optional(),
          email: z.string().optional(),
          website: z.string().optional(),
          instagram: z.string().optional(),
          facebook: z.string().optional(),
          linkedin: z.string().optional(),
          twitter: z.string().optional(),
          googleRating: z.number().optional(),
          reviewCount: z.number().optional(),
        }),
      })
    )
    .mutation(({ input, ctx }) => {
      const id = `lead-${Date.now()}-${Math.random().toString(36).slice(2)}`
      const now = new Date().toISOString()

      const storedLead: StoredLead = {
        ...input.lead,
        businessName: sanitizeText(input.lead.businessName),
        category: sanitizeText(input.lead.category),
        id,
        userId: ctx.userId!, // Associate lead with user
        stage: 'new',
        notes: [],
        tags: [],
        activities: [
          {
            id: `activity-${Date.now()}`,
            type: 'stage_changed',
            details: 'Lead added to pipeline',
            createdAt: now,
          },
        ],
        createdAt: now,
        updatedAt: now,
      }

      pipelineLeads.set(id, storedLead)

      return {
        success: true,
        id,
        lead: storedLead,
      }
    }),

  // Remove lead from pipeline (requires authentication)
  removeFromPipeline: protectedProcedure
    .input(z.object({ leadId: z.string() }))
    .mutation(({ input, ctx }) => {
      const lead = pipelineLeads.get(input.leadId)
      // Check ownership before deleting
      if (!lead || lead.userId !== ctx.userId) {
        return { success: false }
      }
      const deleted = pipelineLeads.delete(input.leadId)
      return { success: deleted }
    }),

  // Update lead stage (requires authentication)
  updateStage: protectedProcedure
    .input(
      z.object({
        leadId: z.string(),
        stage: z.enum([
          'new',
          'contacted',
          'qualified',
          'proposal',
          'negotiation',
          'won',
          'lost',
        ]),
      })
    )
    .mutation(({ input, ctx }) => {
      const lead = pipelineLeads.get(input.leadId)
      if (!lead || lead.userId !== ctx.userId) {
        return { success: false, error: 'Lead not found' }
      }

      const oldStage = lead.stage
      lead.stage = input.stage
      lead.updatedAt = new Date().toISOString()

      // Add activity
      lead.activities.push({
        id: `activity-${Date.now()}`,
        type: 'stage_changed',
        details: `Stage changed from "${oldStage}" to "${input.stage}"`,
        createdAt: new Date().toISOString(),
      })

      return { success: true, lead }
    }),

  // Track contact with lead (requires authentication)
  trackContact: protectedProcedure
    .input(
      z.object({
        leadId: z.string(),
        method: z.enum([
          'email',
          'phone',
          'instagram',
          'facebook',
          'linkedin',
          'twitter',
          'website',
          'in_person',
        ]),
        notes: z.string().optional(),
        autoMoveToContacted: z.boolean().default(true),
      })
    )
    .mutation(({ input, ctx }) => {
      const lead = pipelineLeads.get(input.leadId)
      if (!lead || lead.userId !== ctx.userId) {
        return { success: false, error: 'Lead not found' }
      }

      const now = new Date().toISOString()
      lead.lastContactedAt = now
      lead.lastContactMethod = input.method
      lead.updatedAt = now

      // Add activity with sanitized notes
      lead.activities.push({
        id: `activity-${Date.now()}`,
        type: 'contacted',
        contactMethod: input.method,
        details: input.notes ? sanitizeText(input.notes) : `Contacted via ${input.method}`,
        createdAt: now,
      })

      // Auto-move to contacted stage if in "new" stage
      if (input.autoMoveToContacted && lead.stage === 'new') {
        lead.stage = 'contacted'
        lead.activities.push({
          id: `activity-${Date.now()}-stage`,
          type: 'stage_changed',
          details: 'Automatically moved to "contacted" stage',
          createdAt: now,
        })
      }

      return { success: true, lead }
    }),

  // Add note to lead (requires authentication)
  addNote: protectedProcedure
    .input(
      z.object({
        leadId: z.string(),
        note: z.string().min(1),
      })
    )
    .mutation(({ input, ctx }) => {
      const lead = pipelineLeads.get(input.leadId)
      if (!lead || lead.userId !== ctx.userId) {
        return { success: false, error: 'Lead not found' }
      }

      const now = new Date().toISOString()
      const sanitizedNote = sanitizeText(input.note)
      lead.notes.push(sanitizedNote)
      lead.updatedAt = now

      // Add activity
      lead.activities.push({
        id: `activity-${Date.now()}`,
        type: 'note_added',
        details: sanitizedNote,
        createdAt: now,
      })

      return { success: true, lead }
    }),

  // Add tag to lead (requires authentication)
  addTag: protectedProcedure
    .input(
      z.object({
        leadId: z.string(),
        tag: z.string().min(1).max(50), // Limit tag length
      })
    )
    .mutation(({ input, ctx }) => {
      const lead = pipelineLeads.get(input.leadId)
      if (!lead || lead.userId !== ctx.userId) {
        return { success: false, error: 'Lead not found' }
      }

      const sanitizedTag = sanitizeText(input.tag)
      if (!lead.tags.includes(sanitizedTag)) {
        lead.tags.push(sanitizedTag)
        lead.updatedAt = new Date().toISOString()

        // Add activity
        lead.activities.push({
          id: `activity-${Date.now()}`,
          type: 'tag_added',
          details: `Tag "${sanitizedTag}" added`,
          createdAt: new Date().toISOString(),
        })
      }

      return { success: true, lead }
    }),

  // Remove tag from lead (requires authentication)
  removeTag: protectedProcedure
    .input(
      z.object({
        leadId: z.string(),
        tag: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      const lead = pipelineLeads.get(input.leadId)
      if (!lead || lead.userId !== ctx.userId) {
        return { success: false, error: 'Lead not found' }
      }

      lead.tags = lead.tags.filter((t) => t !== input.tag)
      lead.updatedAt = new Date().toISOString()

      return { success: true, lead }
    }),

  // Schedule follow-up (requires authentication)
  scheduleFollowUp: protectedProcedure
    .input(
      z.object({
        leadId: z.string(),
        date: z.string(), // ISO date string
        note: z.string().optional(),
      })
    )
    .mutation(({ input, ctx }) => {
      const lead = pipelineLeads.get(input.leadId)
      if (!lead || lead.userId !== ctx.userId) {
        return { success: false, error: 'Lead not found' }
      }

      const now = new Date().toISOString()
      lead.nextFollowUpAt = input.date
      lead.updatedAt = now

      // Add activity with sanitized note
      lead.activities.push({
        id: `activity-${Date.now()}`,
        type: 'follow_up_scheduled',
        details: input.note ? sanitizeText(input.note) : `Follow-up scheduled for ${new Date(input.date).toLocaleDateString()}`,
        createdAt: now,
      })

      return { success: true, lead }
    }),

  // Get activities for a lead (requires authentication)
  getActivities: protectedProcedure
    .input(z.object({ leadId: z.string() }))
    .query(({ input, ctx }) => {
      const lead = pipelineLeads.get(input.leadId)
      if (!lead || lead.userId !== ctx.userId) {
        return []
      }
      return lead.activities.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    }),

  // Get pipeline leads (requires authentication - returns only user's leads)
  getPipeline: protectedProcedure.query(({ ctx }) => {
    const result: Record<string, StoredLead[]> = {
      new: [],
      contacted: [],
      qualified: [],
      proposal: [],
      negotiation: [],
      won: [],
      lost: [],
    }

    // Only return leads belonging to the authenticated user
    pipelineLeads.forEach((lead) => {
      if (lead.userId === ctx.userId) {
        result[lead.stage].push(lead)
      }
    })

    return result
  }),

  // Get leads due for follow-up (requires authentication - returns only user's leads)
  getFollowUpsDue: protectedProcedure.query(({ ctx }) => {
    const now = new Date()
    const dueLeads: StoredLead[] = []

    // Only return leads belonging to the authenticated user
    pipelineLeads.forEach((lead) => {
      if (lead.userId === ctx.userId && lead.nextFollowUpAt && new Date(lead.nextFollowUpAt) <= now) {
        dueLeads.push(lead)
      }
    })

    return dueLeads.sort((a, b) => {
      if (!a.nextFollowUpAt || !b.nextFollowUpAt) return 0
      return new Date(a.nextFollowUpAt).getTime() - new Date(b.nextFollowUpAt).getTime()
    })
  }),

  // Bulk update leads (requires authentication)
  bulkUpdate: protectedProcedure
    .input(
      z.object({
        leadIds: z.array(z.string()),
        updates: z.object({
          stage: z
            .enum([
              'new',
              'contacted',
              'qualified',
              'proposal',
              'negotiation',
              'won',
              'lost',
            ])
            .optional(),
          tags: z.array(z.string().max(50)).optional(),
        }),
      })
    )
    .mutation(({ input, ctx }) => {
      const { leadIds, updates } = input
      const updatedLeads: StoredLead[] = []
      const now = new Date().toISOString()

      leadIds.forEach((id) => {
        const lead = pipelineLeads.get(id)
        // Only update leads belonging to the authenticated user
        if (lead && lead.userId === ctx.userId) {
          if (updates.stage) {
            const oldStage = lead.stage
            lead.stage = updates.stage
            lead.activities.push({
              id: `activity-${Date.now()}-${id}`,
              type: 'stage_changed',
              details: `Stage changed from "${oldStage}" to "${updates.stage}" (bulk update)`,
              createdAt: now,
            })
          }

          if (updates.tags) {
            updates.tags.forEach((tag) => {
              const sanitizedTag = sanitizeText(tag)
              if (!lead.tags.includes(sanitizedTag)) {
                lead.tags.push(sanitizedTag)
              }
            })
          }

          lead.updatedAt = now
          updatedLeads.push(lead)
        }
      })

      return {
        success: true,
        updatedCount: updatedLeads.length,
        leads: updatedLeads,
      }
    }),

  // Bulk delete leads (requires authentication)
  bulkDelete: protectedProcedure
    .input(z.object({ leadIds: z.array(z.string()) }))
    .mutation(({ input, ctx }) => {
      let deletedCount = 0

      input.leadIds.forEach((id) => {
        const lead = pipelineLeads.get(id)
        // Only delete leads belonging to the authenticated user
        if (lead && lead.userId === ctx.userId) {
          if (pipelineLeads.delete(id)) {
            deletedCount++
          }
        }
      })

      return {
        success: true,
        deletedCount,
      }
    }),

  // Enrich lead with intelligence (Pro feature - requires authentication)
  enrich: protectedProcedure
    .input(z.object({ leadId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const lead = pipelineLeads.get(input.leadId)
      if (!lead || lead.userId !== ctx.userId) {
        return { success: false, error: 'Lead not found' }
      }

      try {
        // Run enrichment
        const enrichment = await enrichLead(lead.website, lead.businessName)

        // Calculate lead score
        const scoring = calculateLeadScore(enrichment, {
          businessName: lead.businessName,
          googleRating: lead.googleRating,
          reviewCount: lead.reviewCount,
        })

        // Get lead category and opportunity value
        const category = getLeadCategory(scoring.totalScore)
        const opportunityValue = calculateOpportunityValue(scoring.opportunities)

        return {
          success: true,
          leadId: input.leadId,
          score: scoring.totalScore,
          category,
          breakdown: scoring.breakdown,
          technologies: enrichment.technologies,
          opportunities: scoring.opportunities,
          opportunityValue,
          growthSignals: scoring.growthSignals,
          insights: scoring.insights,
          pitchRecommendation: scoring.pitchRecommendation,
          websiteAnalysis: enrichment.websiteAnalysis,
          domainInfo: enrichment.domainInfo,
          employeeCount: enrichment.employeeCount,
          fundingInfo: enrichment.fundingInfo,
          enrichedAt: enrichment.enrichedAt,
        }
      } catch (error) {
        console.error('Error enriching lead:', error)
        return {
          success: false,
          error: 'Failed to enrich lead',
        }
      }
    }),

  // Enrich a discovered lead (before adding to pipeline) - available to all users
  // Note: Email discovery is free. Tech stack + scoring is Pro only (handled in frontend)
  // Google Maps ratings/reviews are the primary data source - no separate Yelp/Facebook scraping
  enrichDiscoveredLead: publicProcedure
    .input(
      z.object({
        id: z.string(),
        businessName: z.string(),
        website: z.string().optional(),
        // Email from Google Maps scraper - skip email discovery if present
        email: z.string().optional(),
        googleRating: z.number().optional(),
        reviewCount: z.number().optional(),
        // Social media URLs from Google Maps scraper
        instagram: z.string().optional(),
        facebook: z.string().optional(),
        linkedin: z.string().optional(),
        twitter: z.string().optional(),
        tiktok: z.string().optional(),
        youtube: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      console.log('\n**** [leads.ts] enrichDiscoveredLead called ****')
      console.log('[leads.ts] Input:', JSON.stringify(input, null, 2))
      try {
        console.log('[leads.ts] Calling enrichLead service...')
        console.log('[leads.ts] Existing email from Google Maps:', input.email || 'NONE')
        console.log('[leads.ts] Social media from Google Maps:', {
          instagram: input.instagram,
          facebook: input.facebook,
          linkedin: input.linkedin,
          twitter: input.twitter,
          tiktok: input.tiktok,
          youtube: input.youtube,
        })
        const enrichment = await enrichLead(input.website, input.businessName, {
          // Pass existing email - skip email scraping if present
          existingEmail: input.email,
        })

        console.log('[leads.ts] Enrichment complete!')
        console.log('[leads.ts] Email enrichment:', JSON.stringify(enrichment.emailEnrichment, null, 2))
        console.log('[leads.ts] Social metrics:', JSON.stringify(enrichment.socialMetrics, null, 2))
        console.log('[leads.ts] Technologies found:', enrichment.technologies?.length || 0)

        const scoring = calculateLeadScore(enrichment, {
          businessName: input.businessName,
          googleRating: input.googleRating,
          reviewCount: input.reviewCount,
        })

        const category = getLeadCategory(scoring.totalScore)
        const opportunityValue = calculateOpportunityValue(scoring.opportunities)

        return {
          success: true,
          leadId: input.id,
          score: scoring.totalScore,
          category,
          breakdown: scoring.breakdown,
          technologies: enrichment.technologies,
          techSignals: enrichment.techSignals,
          opportunities: scoring.opportunities,
          opportunityValue,
          growthSignals: scoring.growthSignals,
          insights: scoring.insights,
          pitchRecommendation: scoring.pitchRecommendation,
          websiteAnalysis: enrichment.websiteAnalysis,
          domainInfo: enrichment.domainInfo,
          socialMetrics: enrichment.socialMetrics,
          // Email enrichment data
          emailEnrichment: enrichment.emailEnrichment,
          employeeCount: enrichment.employeeCount,
          fundingInfo: enrichment.fundingInfo,
          jobPostings: enrichment.jobPostings,
          enrichedAt: enrichment.enrichedAt,
          // Preserve social media from Google Maps scraper
          socialMedia: {
            instagram: input.instagram,
            facebook: input.facebook,
            linkedin: input.linkedin,
            twitter: input.twitter,
            tiktok: input.tiktok,
            youtube: input.youtube,
          },
        }
      } catch (error) {
        console.error('Error enriching discovered lead:', error)
        return {
          success: false,
          error: 'Failed to enrich lead',
        }
      }
    }),

  // Bulk enrich multiple leads (Pro feature - requires authentication)
  bulkEnrich: protectedProcedure
    .input(z.object({ leadIds: z.array(z.string()) }))
    .mutation(async ({ input, ctx }) => {
      const leads: Array<{ id: string; website?: string; businessName: string }> = []

      // Gather lead info for enrichment - only for user's own leads
      input.leadIds.forEach((id) => {
        const lead = pipelineLeads.get(id)
        if (lead && lead.userId === ctx.userId) {
          leads.push({
            id: lead.id,
            website: lead.website,
            businessName: lead.businessName,
          })
        }
      })

      if (leads.length === 0) {
        return {
          success: false,
          error: 'No valid leads found',
          results: [],
        }
      }

      try {
        // Run bulk enrichment
        const enrichmentResults = await bulkEnrichLeads(leads)

        // Process results and calculate scores
        const results: Array<{
          leadId: string
          score: number
          category: 'hot' | 'warm' | 'cold' | 'low'
          opportunityValue: { monthly: number; yearly: number }
        }> = []

        enrichmentResults.forEach((enrichment, leadId) => {
          const lead = pipelineLeads.get(leadId)
          if (lead) {
            const scoring = calculateLeadScore(enrichment, {
              businessName: lead.businessName,
              googleRating: lead.googleRating,
              reviewCount: lead.reviewCount,
            })

            const category = getLeadCategory(scoring.totalScore)
            const opportunityValue = calculateOpportunityValue(scoring.opportunities)

            results.push({
              leadId,
              score: scoring.totalScore,
              category,
              opportunityValue,
            })
          }
        })

        return {
          success: true,
          totalProcessed: results.length,
          results,
        }
      } catch (error) {
        console.error('Error bulk enriching leads:', error)
        return {
          success: false,
          error: 'Failed to bulk enrich leads',
          results: [],
        }
      }
    }),

  // ==========================================
  // HIGH-INTENT BUSINESS SEARCH (Premium Feature)
  // Find businesses actively hiring = high buying intent
  // ==========================================

  // Get service types for high-intent search dropdown
  getHighIntentServiceTypes: publicProcedure.query(() => {
    return getServiceTypes()
  }),

  // Get US states for high-intent search dropdown
  getHighIntentStates: publicProcedure.query(() => {
    return getUSStates()
  }),

  // Search for high-intent businesses (Premium - uses 3 credits per search)
  searchHighIntent: protectedProcedure
    .input(
      z.object({
        state: z.string().min(1, 'State is required'),
        industry: z.string().min(1, 'Industry is required'),
        serviceType: z.string().min(1, 'Service type is required'),
        maxResultsPerSource: z.number().min(5).max(50).default(15),
      })
    )
    .mutation(async ({ input }) => {
      console.log('[leads.ts] searchHighIntent called with:', input)

      try {
        const result = await searchHighIntentBusinesses(
          input.state,
          input.industry,
          input.serviceType,
          input.maxResultsPerSource
        )

        return {
          success: true,
          ...result,
        }
      } catch (error: any) {
        console.error('[leads.ts] High-intent search error:', error)
        return {
          success: false,
          error: error.message || 'Failed to search for high-intent businesses',
          businesses: [],
          searchedAt: new Date().toISOString(),
          query: input,
          sources: { indeed: 0, upwork: 0, linkedin: 0 },
          creditsUsed: 0,
        }
      }
    }),
})
