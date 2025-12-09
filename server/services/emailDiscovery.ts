import { ApifyClient } from 'apify-client'

const client = new ApifyClient({
  token: process.env.APIFY_API_TOKEN,
})

export interface DiscoveredEmail {
  email: string
  source: 'website' | 'contact_page' | 'footer' | 'about_page'
  confidence: 'high' | 'medium' | 'low'
}

export interface EmailDiscoveryResult {
  emails: DiscoveredEmail[]
  scrapedAt: string
  websiteUrl: string
  pagesScraped: number
}

// Email patterns to filter out (spam, generic, noreply)
const EXCLUDED_EMAIL_PATTERNS = [
  /noreply@/i,
  /no-reply@/i,
  /donotreply@/i,
  /mailer-daemon@/i,
  /postmaster@/i,
  /webmaster@/i,
  /abuse@/i,
  /spam@/i,
  /newsletter@/i,
  /unsubscribe@/i,
  /@example\.com$/i,
  /@test\.com$/i,
  /@localhost$/i,
  /@sentry\.io$/i,
  /@wixpress\.com$/i,
  /@squarespace\.com$/i,
]

// High-value email patterns for local businesses
const HIGH_VALUE_PATTERNS = [
  /^info@/i,
  /^contact@/i,
  /^hello@/i,
  /^hi@/i,
  /^support@/i,
  /^sales@/i,
  /^bookings?@/i,
  /^appointments?@/i,
  /^reservations?@/i,
  /^inquir(y|ies)@/i,
  /^admin@/i,
  /^office@/i,
  /^manager@/i,
  /^owner@/i,
]

/**
 * Scrape emails from a business website using Apify Contact Info Scraper
 * Best for local businesses: restaurants, salons, HVAC, plumbers, etc.
 */
export async function scrapeEmailsFromWebsite(
  websiteUrl: string
): Promise<EmailDiscoveryResult> {
  console.log('\n--- [EmailDiscovery] scrapeEmailsFromWebsite called ---')
  console.log('[EmailDiscovery] APIFY_API_TOKEN set:', !!process.env.APIFY_API_TOKEN)
  console.log('[EmailDiscovery] Token first 10 chars:', process.env.APIFY_API_TOKEN?.substring(0, 10) || 'NOT SET')

  const result: EmailDiscoveryResult = {
    emails: [],
    scrapedAt: new Date().toISOString(),
    websiteUrl,
    pagesScraped: 0,
  }

  try {
    // Ensure URL has protocol
    const url = websiteUrl.startsWith('http')
      ? websiteUrl
      : `https://${websiteUrl}`

    console.log(`[EmailDiscovery] Scraping emails from: ${url}`)
    console.log('[EmailDiscovery] Calling Apify actor: vdrmota/contact-info-scraper')

    // Use vdrmota/contact-info-scraper - optimized for finding contact info
    const run = await client.actor('vdrmota/contact-info-scraper').call({
      startUrls: [{ url }],
      maxRequestsPerCrawl: 20, // Limit to important pages
      maxDepth: 2, // Don't go too deep
      considerChildFrames: true,
      // Focus on contact-related pages
      pseudoUrls: [
        `${url}*contact*`,
        `${url}*about*`,
        `${url}*team*`,
        `${url}*staff*`,
      ],
    })

    console.log('[EmailDiscovery] Apify actor call completed! Run ID:', run.id)

    const { items } = await client.dataset(run.defaultDatasetId).listItems()
    result.pagesScraped = items.length

    // Extract and dedupe emails from all scraped pages
    const emailSet = new Set<string>()
    const emailSources = new Map<string, string>()

    items.forEach((item: any) => {
      const emails = item.emails || item.email || []
      const pageUrl = item.url || ''

      const emailList = Array.isArray(emails) ? emails : [emails]
      emailList.forEach((email: string) => {
        if (email && isValidEmail(email) && !isExcludedEmail(email)) {
          const normalizedEmail = email.toLowerCase().trim()
          if (!emailSet.has(normalizedEmail)) {
            emailSet.add(normalizedEmail)
            emailSources.set(normalizedEmail, detectSource(pageUrl))
          }
        }
      })
    })

    // Convert to DiscoveredEmail array with confidence scores
    result.emails = Array.from(emailSet).map((email) => ({
      email,
      source: emailSources.get(email) as DiscoveredEmail['source'],
      confidence: determineConfidence(email),
    }))

    // Sort by confidence (high first) then alphabetically
    result.emails.sort((a, b) => {
      const confidenceOrder = { high: 0, medium: 1, low: 2 }
      const confDiff = confidenceOrder[a.confidence] - confidenceOrder[b.confidence]
      if (confDiff !== 0) return confDiff
      return a.email.localeCompare(b.email)
    })

    console.log(
      `[EmailDiscovery] Found ${result.emails.length} emails from ${result.pagesScraped} pages`
    )

    return result
  } catch (error: any) {
    console.error('[EmailDiscovery] ERROR scraping website:', error)
    console.error('[EmailDiscovery] Error message:', error?.message)
    console.error('[EmailDiscovery] Error stack:', error?.stack)
    return result
  }
}

/**
 * Alternative: Use simple website scraper for faster results
 * Good fallback if contact-info-scraper is unavailable
 */
export async function scrapeEmailsSimple(
  websiteUrl: string
): Promise<DiscoveredEmail[]> {
  try {
    const url = websiteUrl.startsWith('http')
      ? websiteUrl
      : `https://${websiteUrl}`

    // Use cheerio-scraper for lightweight scraping
    const run = await client.actor('apify/cheerio-scraper').call({
      startUrls: [{ url }],
      maxRequestsPerCrawl: 5,
      pageFunction: async function pageFunction(context: any) {
        const { $, request } = context
        const emails: string[] = []

        // Extract from mailto links
        $('a[href^="mailto:"]').each((_: number, el: any) => {
          const mailto = $(el).attr('href')
          if (mailto) {
            const email = mailto.replace('mailto:', '').split('?')[0]
            emails.push(email)
          }
        })

        // Extract emails from text using regex
        const bodyText = $('body').text()
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
        const textEmails = bodyText.match(emailRegex) || []
        emails.push(...textEmails)

        return {
          url: request.url,
          emails: [...new Set(emails)],
        }
      },
    })

    const { items } = await client.dataset(run.defaultDatasetId).listItems()

    const emailSet = new Set<string>()
    items.forEach((item: any) => {
      const emails = item.emails || []
      emails.forEach((email: string) => {
        if (email && isValidEmail(email) && !isExcludedEmail(email)) {
          emailSet.add(email.toLowerCase().trim())
        }
      })
    })

    return Array.from(emailSet).map((email) => ({
      email,
      source: 'website' as const,
      confidence: determineConfidence(email),
    }))
  } catch (error) {
    console.error('[EmailDiscovery] Simple scrape error:', error)
    return []
  }
}

/**
 * Filter business emails - remove spam, generic, and low-value emails
 */
export function filterBusinessEmails(emails: DiscoveredEmail[]): DiscoveredEmail[] {
  return emails.filter((e) => {
    // Keep high confidence emails
    if (e.confidence === 'high') return true

    // Keep medium confidence if from good source
    if (e.confidence === 'medium' && e.source === 'contact_page') return true

    // Filter out low confidence unless it matches business domain
    return e.confidence !== 'low'
  })
}

/**
 * Get the best email for a business (typically info@, contact@, or owner email)
 */
export function getBestBusinessEmail(
  emails: DiscoveredEmail[]
): DiscoveredEmail | null {
  if (emails.length === 0) return null

  // Priority: high confidence > medium confidence > low confidence
  const sorted = [...emails].sort((a, b) => {
    const confidenceOrder = { high: 0, medium: 1, low: 2 }
    return confidenceOrder[a.confidence] - confidenceOrder[b.confidence]
  })

  return sorted[0]
}

// Helper functions

function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

function isExcludedEmail(email: string): boolean {
  return EXCLUDED_EMAIL_PATTERNS.some((pattern) => pattern.test(email))
}

function detectSource(pageUrl: string): DiscoveredEmail['source'] {
  const urlLower = pageUrl.toLowerCase()
  if (urlLower.includes('contact')) return 'contact_page'
  if (urlLower.includes('about')) return 'about_page'
  if (urlLower.includes('footer')) return 'footer'
  return 'website'
}

function determineConfidence(email: string): DiscoveredEmail['confidence'] {
  // High confidence: common business email patterns
  if (HIGH_VALUE_PATTERNS.some((pattern) => pattern.test(email))) {
    return 'high'
  }

  // Medium confidence: looks like a personal business email
  const localPart = email.split('@')[0]

  // Personal names (firstname, firstname.lastname) are medium confidence
  if (/^[a-z]+(\.[a-z]+)?$/.test(localPart) && localPart.length > 2) {
    return 'medium'
  }

  // Low confidence: generic or unclear
  return 'low'
}

/**
 * Extract email domain to verify it matches business website
 */
export function getEmailDomain(email: string): string {
  return email.split('@')[1]?.toLowerCase() || ''
}

/**
 * Check if email domain matches website domain
 */
export function emailMatchesWebsite(
  email: string,
  websiteUrl: string
): boolean {
  try {
    const emailDomain = getEmailDomain(email)
    const url = new URL(
      websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`
    )
    const websiteDomain = url.hostname.replace('www.', '')
    return emailDomain === websiteDomain
  } catch {
    return false
  }
}
