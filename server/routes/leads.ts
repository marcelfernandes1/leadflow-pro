import { z } from 'zod'
import { router, publicProcedure } from '../trpc.js'
import { searchLeads } from '../services/apify.js'
import { checkCache, saveToCache, getCacheStats } from '../services/cache.js'

// In-memory storage for development (will use database in production)
interface StoredLead {
  id: string
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
  search: publicProcedure
    .input(
      z.object({
        category: z.string().min(1),
        location: z.string().min(1),
        minRating: z.number().optional(),
        maxResults: z.number().default(100),
      })
    )
    .mutation(async ({ input }) => {
      const { category, location, minRating, maxResults } = input

      // Check cache first
      const cached = checkCache(category, location)
      if (cached) {
        let leads = cached.leads

        // Apply filters to cached results
        if (minRating) {
          leads = leads.filter(
            (lead) => lead.googleRating && lead.googleRating >= minRating
          )
        }

        // Limit results
        leads = leads.slice(0, maxResults)

        return {
          leads,
          count: leads.length,
          cached: true,
        }
      }

      // Search using Apify
      const leads = await searchLeads({
        searchQuery: `${category} in ${location}`,
        maxResults,
        minRating,
      })

      // Save to cache
      saveToCache(category, location, leads)

      return {
        leads,
        count: leads.length,
        cached: false,
      }
    }),

  // Get cache statistics
  getCacheStats: publicProcedure.query(() => {
    return getCacheStats()
  }),

  // Get a single lead by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return pipelineLeads.get(input.id) || null
    }),

  // Add lead to pipeline
  addToPipeline: publicProcedure
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
    .mutation(({ input }) => {
      const id = `lead-${Date.now()}-${Math.random().toString(36).slice(2)}`
      const now = new Date().toISOString()

      const storedLead: StoredLead = {
        ...input.lead,
        id,
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

  // Remove lead from pipeline
  removeFromPipeline: publicProcedure
    .input(z.object({ leadId: z.string() }))
    .mutation(({ input }) => {
      const deleted = pipelineLeads.delete(input.leadId)
      return { success: deleted }
    }),

  // Update lead stage
  updateStage: publicProcedure
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
    .mutation(({ input }) => {
      const lead = pipelineLeads.get(input.leadId)
      if (!lead) {
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

  // Track contact with lead
  trackContact: publicProcedure
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
    .mutation(({ input }) => {
      const lead = pipelineLeads.get(input.leadId)
      if (!lead) {
        return { success: false, error: 'Lead not found' }
      }

      const now = new Date().toISOString()
      lead.lastContactedAt = now
      lead.lastContactMethod = input.method
      lead.updatedAt = now

      // Add activity
      lead.activities.push({
        id: `activity-${Date.now()}`,
        type: 'contacted',
        contactMethod: input.method,
        details: input.notes || `Contacted via ${input.method}`,
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

  // Add note to lead
  addNote: publicProcedure
    .input(
      z.object({
        leadId: z.string(),
        note: z.string().min(1),
      })
    )
    .mutation(({ input }) => {
      const lead = pipelineLeads.get(input.leadId)
      if (!lead) {
        return { success: false, error: 'Lead not found' }
      }

      const now = new Date().toISOString()
      lead.notes.push(input.note)
      lead.updatedAt = now

      // Add activity
      lead.activities.push({
        id: `activity-${Date.now()}`,
        type: 'note_added',
        details: input.note,
        createdAt: now,
      })

      return { success: true, lead }
    }),

  // Add tag to lead
  addTag: publicProcedure
    .input(
      z.object({
        leadId: z.string(),
        tag: z.string().min(1),
      })
    )
    .mutation(({ input }) => {
      const lead = pipelineLeads.get(input.leadId)
      if (!lead) {
        return { success: false, error: 'Lead not found' }
      }

      if (!lead.tags.includes(input.tag)) {
        lead.tags.push(input.tag)
        lead.updatedAt = new Date().toISOString()

        // Add activity
        lead.activities.push({
          id: `activity-${Date.now()}`,
          type: 'tag_added',
          details: `Tag "${input.tag}" added`,
          createdAt: new Date().toISOString(),
        })
      }

      return { success: true, lead }
    }),

  // Remove tag from lead
  removeTag: publicProcedure
    .input(
      z.object({
        leadId: z.string(),
        tag: z.string(),
      })
    )
    .mutation(({ input }) => {
      const lead = pipelineLeads.get(input.leadId)
      if (!lead) {
        return { success: false, error: 'Lead not found' }
      }

      lead.tags = lead.tags.filter((t) => t !== input.tag)
      lead.updatedAt = new Date().toISOString()

      return { success: true, lead }
    }),

  // Schedule follow-up
  scheduleFollowUp: publicProcedure
    .input(
      z.object({
        leadId: z.string(),
        date: z.string(), // ISO date string
        note: z.string().optional(),
      })
    )
    .mutation(({ input }) => {
      const lead = pipelineLeads.get(input.leadId)
      if (!lead) {
        return { success: false, error: 'Lead not found' }
      }

      const now = new Date().toISOString()
      lead.nextFollowUpAt = input.date
      lead.updatedAt = now

      // Add activity
      lead.activities.push({
        id: `activity-${Date.now()}`,
        type: 'follow_up_scheduled',
        details: input.note || `Follow-up scheduled for ${new Date(input.date).toLocaleDateString()}`,
        createdAt: now,
      })

      return { success: true, lead }
    }),

  // Get activities for a lead
  getActivities: publicProcedure
    .input(z.object({ leadId: z.string() }))
    .query(({ input }) => {
      const lead = pipelineLeads.get(input.leadId)
      if (!lead) {
        return []
      }
      return lead.activities.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    }),

  // Get pipeline leads
  getPipeline: publicProcedure.query(() => {
    const result: Record<string, StoredLead[]> = {
      new: [],
      contacted: [],
      qualified: [],
      proposal: [],
      negotiation: [],
      won: [],
      lost: [],
    }

    pipelineLeads.forEach((lead) => {
      result[lead.stage].push(lead)
    })

    return result
  }),

  // Get leads due for follow-up
  getFollowUpsDue: publicProcedure.query(() => {
    const now = new Date()
    const dueLeads: StoredLead[] = []

    pipelineLeads.forEach((lead) => {
      if (lead.nextFollowUpAt && new Date(lead.nextFollowUpAt) <= now) {
        dueLeads.push(lead)
      }
    })

    return dueLeads.sort((a, b) => {
      if (!a.nextFollowUpAt || !b.nextFollowUpAt) return 0
      return new Date(a.nextFollowUpAt).getTime() - new Date(b.nextFollowUpAt).getTime()
    })
  }),

  // Bulk update leads
  bulkUpdate: publicProcedure
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
          tags: z.array(z.string()).optional(),
        }),
      })
    )
    .mutation(({ input }) => {
      const { leadIds, updates } = input
      const updatedLeads: StoredLead[] = []
      const now = new Date().toISOString()

      leadIds.forEach((id) => {
        const lead = pipelineLeads.get(id)
        if (lead) {
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
              if (!lead.tags.includes(tag)) {
                lead.tags.push(tag)
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

  // Bulk delete leads
  bulkDelete: publicProcedure
    .input(z.object({ leadIds: z.array(z.string()) }))
    .mutation(({ input }) => {
      let deletedCount = 0

      input.leadIds.forEach((id) => {
        if (pipelineLeads.delete(id)) {
          deletedCount++
        }
      })

      return {
        success: true,
        deletedCount,
      }
    }),

  // Enrich lead with intelligence (Pro feature)
  enrich: publicProcedure
    .input(z.object({ leadId: z.string() }))
    .mutation(async ({ input: _input }) => {
      // TODO: Implement lead enrichment
      // 1. Detect technology stack
      // 2. Check for job postings
      // 3. Calculate lead score
      // 4. Generate AI insights
      return {
        success: true,
        score: 0,
        technologies: [],
        opportunities: [],
        insights: [],
      }
    }),
})
