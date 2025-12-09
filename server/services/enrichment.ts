import { ApifyClient } from 'apify-client'
import {
  scrapeEmailsFromWebsite,
  getBestBusinessEmail,
  type DiscoveredEmail,
} from './emailDiscovery.js'
import {
  verifyEmail,
  type EmailVerificationResult,
} from './emailVerification.js'

const client = new ApifyClient({
  token: process.env.APIFY_API_TOKEN,
})

// ==========================================
// JOB POSTINGS CACHE (60-day TTL)
// ==========================================
const JOB_CACHE_TTL_MS = 60 * 24 * 60 * 60 * 1000 // 60 days in milliseconds

interface JobCacheEntry {
  jobs: JobPosting[]
  scrapedAt: number
  expiresAt: number
}

// In-memory cache for job postings
const jobPostingsCache = new Map<string, JobCacheEntry>()

/**
 * Normalize company name for cache key
 */
function normalizeCompanyName(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]/g, '')
}

/**
 * Check if a cache entry is still valid
 */
function isCacheValid(entry: JobCacheEntry): boolean {
  return Date.now() < entry.expiresAt
}

/**
 * Get cached job postings for a company
 */
function getCachedJobPostings(companyName: string): JobPosting[] | null {
  const key = normalizeCompanyName(companyName)
  const entry = jobPostingsCache.get(key)

  if (entry && isCacheValid(entry)) {
    console.log(`[Job Cache] HIT for "${companyName}" - ${entry.jobs.length} jobs (expires in ${Math.round((entry.expiresAt - Date.now()) / (1000 * 60 * 60 * 24))} days)`)
    return entry.jobs
  }

  // Remove expired entry if exists
  if (entry) {
    console.log(`[Job Cache] EXPIRED for "${companyName}" - removing`)
    jobPostingsCache.delete(key)
  }

  return null
}

/**
 * Cache job postings for a company
 */
function cacheJobPostings(companyName: string, jobs: JobPosting[]): void {
  const key = normalizeCompanyName(companyName)
  const now = Date.now()

  jobPostingsCache.set(key, {
    jobs,
    scrapedAt: now,
    expiresAt: now + JOB_CACHE_TTL_MS,
  })

  console.log(`[Job Cache] STORED ${jobs.length} jobs for "${companyName}" (expires in 60 days)`)
}

/**
 * Clear expired entries from cache (call periodically)
 */
export function cleanupJobCache(): void {
  let removed = 0
  const keysToRemove: string[] = []

  jobPostingsCache.forEach((entry, key) => {
    if (!isCacheValid(entry)) {
      keysToRemove.push(key)
    }
  })

  keysToRemove.forEach((key) => {
    jobPostingsCache.delete(key)
    removed++
  })

  if (removed > 0) {
    console.log(`[Job Cache] Cleaned up ${removed} expired entries`)
  }
}

/**
 * Get cache statistics
 */
export function getJobCacheStats(): { size: number; totalJobs: number } {
  let totalJobs = 0
  jobPostingsCache.forEach((entry) => {
    if (isCacheValid(entry)) {
      totalJobs += entry.jobs.length
    }
  })
  return { size: jobPostingsCache.size, totalJobs }
}

// Types for enrichment data
export interface TechnologyInfo {
  name: string
  category: string
  detected: boolean
  version?: string
}

export interface JobPosting {
  title: string
  date: string
  source: 'Indeed' | 'Upwork'
  url?: string
  budget?: string // For Upwork jobs
  skills?: string[] // For Upwork jobs
}

export interface WebsiteAnalysis {
  performanceScore: number
  accessibilityScore: number
  seoScore: number
  isMobileFriendly: boolean
  loadTime: number
}

export interface DomainInfo {
  age: number // years
  registrationDate: string
  expirationDate?: string
  registrar?: string
}

// Social metrics now come directly from Google Maps scraper
// No separate scraping needed - Google ratings/reviews are the primary source
export interface SocialMetrics {
  // Placeholder for any future social data needs
}

// Technology signals from website analysis
export interface TechSignals {
  hasFacebookPixel: boolean
  hasSchema: boolean
  hasGoogleRemarketing: boolean
  hasGoogleAnalytics: boolean
  hasLinkedInAnalytics: boolean
  usesWordPress: boolean
  usesShopify: boolean
  isMobileFriendly: boolean
}

export interface EmailEnrichment {
  discoveredEmails: DiscoveredEmail[]
  bestEmail: DiscoveredEmail | null
  verification: EmailVerificationResult | null
}

export interface EnrichmentResult {
  technologies: TechnologyInfo[]
  techSignals: TechSignals | null
  jobPostings: JobPosting[]
  websiteAnalysis: WebsiteAnalysis | null
  domainInfo: DomainInfo | null
  socialMetrics: SocialMetrics | null
  emailEnrichment: EmailEnrichment | null
  employeeCount: number | null
  fundingInfo: {
    hasRecentFunding: boolean
    amount?: number
    date?: string
  } | null
  enrichedAt: string
}

// Technology categories for scoring
const TECHNOLOGY_CATEGORIES: Record<string, string[]> = {
  CRM: ['salesforce', 'hubspot', 'zoho', 'pipedrive', 'freshsales', 'copper'],
  'Email Marketing': [
    'mailchimp',
    'klaviyo',
    'sendgrid',
    'constant-contact',
    'mailerlite',
    'activecampaign',
  ],
  'Chat/Support': [
    'intercom',
    'zendesk',
    'drift',
    'freshdesk',
    'crisp',
    'tidio',
    'livechat',
  ],
  Analytics: [
    'google-analytics',
    'google-tag-manager',
    'mixpanel',
    'amplitude',
    'hotjar',
    'segment',
  ],
  'E-commerce': [
    'shopify',
    'woocommerce',
    'bigcommerce',
    'magento',
    'prestashop',
    'squarespace',
  ],
  'Marketing Automation': [
    'marketo',
    'pardot',
    'activecampaign',
    'eloqua',
    'drip',
  ],
  CMS: ['wordpress', 'drupal', 'joomla', 'webflow', 'wix', 'squarespace'],
  Advertising: [
    'google-ads',
    'facebook-pixel',
    'linkedin-insight',
    'twitter-pixel',
  ],
}

/**
 * Detect technology stack for a website
 * Uses Apify's website tech detector
 */
export async function detectTechStack(
  websiteUrl: string
): Promise<TechnologyInfo[]> {
  try {
    const run = await client
      .actor('benthepythondev/website-tech-detector')
      .call({
        url: websiteUrl,
        timeout: 30,
      })

    const { items } = await client.dataset(run.defaultDatasetId).listItems()

    const technologies: TechnologyInfo[] = []

    items.forEach((item: any) => {
      if (item.technologies && Array.isArray(item.technologies)) {
        item.technologies.forEach((tech: any) => {
          const techName = typeof tech === 'string' ? tech : tech.name
          if (techName) {
            technologies.push({
              name: techName,
              category: categorizeTechnology(techName.toLowerCase()),
              detected: true,
              version: typeof tech === 'object' ? tech.version : undefined,
            })
          }
        })
      }
    })

    return technologies
  } catch (error) {
    console.error('Error detecting tech stack:', error)
    return []
  }
}

/**
 * Categorize a technology by name
 */
function categorizeTechnology(techName: string): string {
  for (const [category, techs] of Object.entries(TECHNOLOGY_CATEGORIES)) {
    if (techs.some((t) => techName.includes(t))) {
      return category
    }
  }
  return 'Other'
}

/**
 * Get Google PageSpeed Insights analysis
 * NOTE: Disabled for now - can be enabled later by adding GOOGLE_PAGESPEED_API_KEY
 */
export async function analyzeWebsite(
  _websiteUrl: string
): Promise<WebsiteAnalysis | null> {
  // PageSpeed analysis disabled - return null
  // To enable, uncomment the code below and add GOOGLE_PAGESPEED_API_KEY to .env
  return null
}

/**
 * Get domain age information using WhoisXML API
 */
export async function getDomainInfo(domain: string): Promise<DomainInfo | null> {
  const apiKey = process.env.WHOIS_API_KEY

  if (!apiKey) {
    console.warn('[Enrichment] WHOIS_API_KEY not set - skipping domain info')
    return null
  }

  try {
    const response = await fetch(
      `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${apiKey}&domainName=${domain}&outputFormat=json`
    )

    if (!response.ok) {
      throw new Error(`WHOIS API error: ${response.status}`)
    }

    const data = await response.json()
    const registryData = data.WhoisRecord?.registryData || data.WhoisRecord

    if (!registryData?.createdDate) {
      return null
    }

    const createdDate = new Date(registryData.createdDate)
    const now = new Date()
    const ageInYears = Math.floor(
      (now.getTime() - createdDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    )

    return {
      age: ageInYears,
      registrationDate: registryData.createdDate,
      expirationDate: registryData.expiresDate,
      registrar: registryData.registrarName,
    }
  } catch (error) {
    console.error('Error getting domain info:', error)
    return null
  }
}

/**
 * Search for job postings on Indeed
 */
export async function searchIndeedJobs(
  companyName: string
): Promise<JobPosting[]> {
  try {
    const run = await client.actor('misceres/indeed-scraper').call({
      queries: [companyName],
      maxResults: 10,
      country: 'US',
    })

    const { items } = await client.dataset(run.defaultDatasetId).listItems()

    return items.map((item: any) => ({
      title: item.title || 'Unknown Position',
      date: item.postedAt || new Date().toISOString(),
      source: 'Indeed' as const,
      url: item.url,
    }))
  } catch (error) {
    console.error('Error searching Indeed jobs:', error)
    return []
  }
}

/**
 * Search for job postings on Upwork
 * PRD: neatrat/upwork-job-scraper
 */
export async function searchUpworkJobs(
  searchQuery: string
): Promise<JobPosting[]> {
  try {
    const run = await client.actor('neatrat/upwork-job-scraper').call({
      searchQuery,
      country: 'United States',
      maxResults: 10,
    })

    const { items } = await client.dataset(run.defaultDatasetId).listItems()

    return items.map((item: any) => ({
      title: item.title || 'Unknown Project',
      date: item.postedDate || new Date().toISOString(),
      source: 'Upwork' as const,
      url: item.url,
      budget: item.budget || item.hourlyRate,
      skills: item.skills || [],
    }))
  } catch (error) {
    console.error('Error searching Upwork jobs:', error)
    return []
  }
}

/**
 * Search for job postings across multiple sources
 * Results are cached for 60 days to reduce API calls
 */
export async function searchJobPostings(
  companyName: string
): Promise<JobPosting[]> {
  // Check cache first
  const cachedJobs = getCachedJobPostings(companyName)
  if (cachedJobs !== null) {
    return cachedJobs
  }

  console.log(`[Job Cache] MISS for "${companyName}" - fetching from APIs...`)

  // Run both Indeed and Upwork searches in parallel
  const [indeedJobs, upworkJobs] = await Promise.all([
    searchIndeedJobs(companyName),
    searchUpworkJobs(companyName),
  ])

  // Combine and sort by date (most recent first)
  const allJobs = [...indeedJobs, ...upworkJobs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  // Cache the results
  cacheJobPostings(companyName, allJobs)

  return allJobs
}

/**
 * Lead data for enrichment
 * Simplified - social metrics come from Google Maps scraper directly
 */
export interface LeadEnrichmentInput {
  website?: string
  businessName: string
  // If email already discovered (e.g., from Google Maps scraper), skip email scraping
  existingEmail?: string
}

/**
 * Full enrichment for a lead
 * Simplified: Email discovery + Tech stack detection (Pro only)
 * Google Maps ratings/reviews come directly from the scraper - no need for separate Yelp/Facebook
 */
export async function enrichLead(
  website: string | undefined,
  businessName: string,
  options?: {
    // If email already discovered (e.g., from Google Maps scraper), skip email scraping
    existingEmail?: string
  }
): Promise<EnrichmentResult> {
  console.log('\n========================================')
  console.log('[Enrichment] Starting enrichment for:', businessName)
  console.log('[Enrichment] Website:', website || 'NONE')
  console.log('[Enrichment] Existing email:', options?.existingEmail || 'NONE')
  console.log('========================================\n')

  const result: EnrichmentResult = {
    technologies: [],
    techSignals: null,
    jobPostings: [],
    websiteAnalysis: null,
    domainInfo: null,
    socialMetrics: null,
    emailEnrichment: null,
    employeeCount: null,
    fundingInfo: null,
    enrichedAt: new Date().toISOString(),
  }

  // Run enrichment tasks in parallel where possible
  const promises: Promise<void>[] = []

  // Email discovery - SKIP if we already have an email from Google Maps scraper
  let discoveredEmails: DiscoveredEmail[] = []
  if (options?.existingEmail) {
    // Use existing email from Google Maps scraper - no need to scrape again
    console.log('[Enrichment] Using existing email from Google Maps scraper:', options.existingEmail)
    discoveredEmails = [{
      email: options.existingEmail,
      source: 'website' as const,
      confidence: 'high' as const, // Trust Google Maps data
    }]
  } else if (website) {
    // No email from Google Maps - fall back to separate email scraping
    console.log('[Enrichment] No existing email, starting email scraping from website...')
    promises.push(
      scrapeEmailsFromWebsite(website)
        .then((emailResult) => {
          console.log('[Enrichment] Email scraping complete. Found:', emailResult.emails.length, 'emails')
          discoveredEmails = emailResult.emails
        })
        .catch((err) => {
          console.error('[Enrichment] Email scraping FAILED:', err.message)
        })
    )
  } else {
    console.log('[Enrichment] No email and no website - skipping email discovery')
  }

  // Technology detection (if website exists) - Pro feature
  if (website) {
    promises.push(
      detectTechStack(website).then((techs) => {
        result.technologies = techs
        // Extract tech signals from detected technologies
        result.techSignals = extractTechSignals(techs, result.websiteAnalysis)
      })
    )

    // Domain info (optional)
    const domain = extractDomain(website)
    if (domain) {
      promises.push(
        getDomainInfo(domain).then((info) => {
          result.domainInfo = info
        })
      )
    }
  }

  // Wait for all enrichment tasks (including email discovery)
  await Promise.allSettled(promises)

  // Email verification (after discovery is complete)
  const bestEmail = getBestBusinessEmail(discoveredEmails)
  let emailVerification: EmailVerificationResult | null = null

  if (bestEmail) {
    try {
      emailVerification = await verifyEmail(bestEmail.email)
    } catch (error) {
      console.error('[Enrichment] Email verification error:', error)
    }
  }

  // Set email enrichment result
  if (discoveredEmails.length > 0 || bestEmail) {
    result.emailEnrichment = {
      discoveredEmails,
      bestEmail,
      verification: emailVerification,
    }
  }

  // Re-extract tech signals after website analysis is complete
  if (result.technologies.length > 0) {
    result.techSignals = extractTechSignals(result.technologies, null)
  }

  // Funding info is an Enterprise feature - requires Crunchbase API
  result.fundingInfo = { hasRecentFunding: false }

  return result
}

/**
 * Extract technology signals from detected technologies
 */
function extractTechSignals(
  technologies: TechnologyInfo[],
  websiteAnalysis: WebsiteAnalysis | null
): TechSignals {
  const techNames = technologies.map((t) => t.name.toLowerCase())

  return {
    hasFacebookPixel: techNames.some((t) =>
      t.includes('facebook') && (t.includes('pixel') || t.includes('sdk'))
    ),
    hasSchema: techNames.some((t) =>
      t.includes('schema') || t.includes('json-ld') || t.includes('structured')
    ),
    hasGoogleRemarketing: techNames.some((t) =>
      (t.includes('google') && t.includes('remarketing')) ||
      t.includes('google ads') ||
      t.includes('adwords')
    ),
    hasGoogleAnalytics: techNames.some((t) =>
      t.includes('google analytics') || t.includes('ga4') || t.includes('gtag')
    ),
    hasLinkedInAnalytics: techNames.some((t) =>
      t.includes('linkedin') && (t.includes('insight') || t.includes('analytics'))
    ),
    usesWordPress: techNames.some((t) => t.includes('wordpress')),
    usesShopify: techNames.some((t) => t.includes('shopify')),
    isMobileFriendly: websiteAnalysis?.isMobileFriendly ?? false,
  }
}

/**
 * Bulk enrich multiple leads
 */
export async function bulkEnrichLeads(
  leads: Array<{ id: string; website?: string; businessName: string }>,
  onProgress?: (completed: number, total: number) => void
): Promise<Map<string, EnrichmentResult>> {
  const results = new Map<string, EnrichmentResult>()
  let completed = 0

  // Process in batches of 5 to avoid rate limits
  const batchSize = 5

  for (let i = 0; i < leads.length; i += batchSize) {
    const batch = leads.slice(i, i + batchSize)

    const batchPromises = batch.map(async (lead) => {
      try {
        const enrichment = await enrichLead(lead.website, lead.businessName)
        results.set(lead.id, enrichment)
      } catch (error) {
        console.error(`Error enriching lead ${lead.id}:`, error)
      }
      completed++
      onProgress?.(completed, leads.length)
    })

    await Promise.allSettled(batchPromises)

    // Small delay between batches to respect rate limits
    if (i + batchSize < leads.length) {
      await new Promise((r) => setTimeout(r, 500))
    }
  }

  return results
}

// Helper functions

function extractDomain(url: string): string | null {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`)
    return parsed.hostname.replace('www.', '')
  } catch {
    return null
  }
}

