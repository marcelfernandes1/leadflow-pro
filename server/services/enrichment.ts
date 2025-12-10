import { ApifyClient } from 'apify-client'
import {
  getBestBusinessEmail,
  type DiscoveredEmail,
} from './emailDiscovery.js'
import {
  verifyEmail,
  type EmailVerificationResult,
} from './emailVerification.js'
import {
  detectTechStackLocal,
  isTechDetectorHealthy,
} from './techDetector.js'

const client = new ApifyClient({
  token: process.env.APIFY_API_TOKEN,
})

// Track if local tech detector is available
let localTechDetectorAvailable: boolean | null = null

// Types for enrichment data
export interface TechnologyInfo {
  name: string
  category: string
  detected: boolean
  version?: string
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
  websiteAnalysis: WebsiteAnalysis | null
  domainInfo: DomainInfo | null
  socialMetrics: SocialMetrics | null
  emailEnrichment: EmailEnrichment | null
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
 * Uses local Scrapy-based detector first, falls back to Apify Wappalyzer
 */
export async function detectTechStack(
  websiteUrl: string
): Promise<TechnologyInfo[]> {
  // Ensure URL has protocol
  const url = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`

  // Check if local tech detector is available (cached)
  if (localTechDetectorAvailable === null) {
    localTechDetectorAvailable = await isTechDetectorHealthy()
    console.log(`[Tech Stack] Local detector available: ${localTechDetectorAvailable}`)
  }

  // Try local detector first (no API costs, faster)
  if (localTechDetectorAvailable) {
    try {
      const result = await detectTechStackLocal(url)

      if (result.success && result.technologies.length > 0) {
        const technologies: TechnologyInfo[] = result.technologies.map((tech) => ({
          name: tech.name,
          category: tech.category,
          detected: true,
          version: undefined,
        }))

        console.log(`[Tech Stack] Local detector found ${technologies.length} technologies for ${websiteUrl}`)
        return technologies
      }

      // If local detector failed or found nothing, continue to fallback
      if (!result.success) {
        console.warn(`[Tech Stack] Local detector error: ${result.error}`)
      }
    } catch (error) {
      console.warn('[Tech Stack] Local detector failed, falling back to Apify:', error)
      // Mark as unavailable temporarily
      localTechDetectorAvailable = false
    }
  }

  // Fallback to Apify Wappalyzer
  try {
    const run = await client
      .actor('topaz/wappalyzer')
      .call({
        urls: [url],
        maxRequestsPerCrawl: 1,
      })

    const { items } = await client.dataset(run.defaultDatasetId).listItems()

    const technologies: TechnologyInfo[] = []

    items.forEach((item: any) => {
      // Wappalyzer returns technologies in a 'technologies' array
      if (item.technologies && Array.isArray(item.technologies)) {
        item.technologies.forEach((tech: any) => {
          const techName = tech.name || tech
          if (techName) {
            technologies.push({
              name: techName,
              category: tech.categories?.[0]?.name || categorizeTechnology(techName.toLowerCase()),
              detected: true,
              version: tech.version || undefined,
            })
          }
        })
      }
    })

    console.log(`[Tech Stack] Apify detected ${technologies.length} technologies for ${websiteUrl}`)
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
    websiteAnalysis: null,
    domainInfo: null,
    socialMetrics: null,
    emailEnrichment: null,
    enrichedAt: new Date().toISOString(),
  }

  // Run enrichment tasks in parallel where possible
  const promises: Promise<void>[] = []

  // Email discovery - Use only email from Google Maps scraper, no website scraping
  let discoveredEmails: DiscoveredEmail[] = []
  if (options?.existingEmail) {
    // Use existing email from Google Maps scraper
    console.log('[Enrichment] Using email from Google Maps scraper:', options.existingEmail)
    discoveredEmails = [{
      email: options.existingEmail,
      source: 'website' as const,
      confidence: 'high' as const,
    }]
  } else {
    console.log('[Enrichment] No email from Google Maps - skipping email enrichment')
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

  // Wait for all enrichment tasks
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
