import { ApifyClient } from 'apify-client'

const client = new ApifyClient({
  token: process.env.APIFY_API_TOKEN,
})

// ==========================================
// HIGH-INTENT BUSINESS SEARCH
// Find businesses actively hiring = high buying intent
// ==========================================

export interface HighIntentBusiness {
  id: string
  companyName: string
  jobTitle: string
  jobDescription?: string
  location: string
  source: 'Indeed' | 'Upwork' | 'LinkedIn'
  postedDate: string
  jobUrl?: string
  budget?: string // For Upwork
  skills?: string[] // For Upwork
  intentSignal: string // Why they're high intent
  companyWebsite?: string
}

export interface HighIntentSearchResult {
  businesses: HighIntentBusiness[]
  searchedAt: string
  query: {
    state: string
    industry: string
    serviceType: string
  }
  sources: {
    indeed: number
    upwork: number
    linkedin: number
  }
  creditsUsed: number
}

// Service categories that indicate buying intent
const SERVICE_KEYWORDS: Record<string, string[]> = {
  'Marketing': [
    'marketing manager',
    'digital marketing',
    'social media manager',
    'marketing agency',
    'seo specialist',
    'content marketing',
    'ppc specialist',
    'marketing consultant',
    'brand manager',
    'growth marketing',
  ],
  'Web Design': [
    'web designer',
    'website developer',
    'web development',
    'wordpress developer',
    'frontend developer',
    'ui/ux designer',
    'website redesign',
    'ecommerce developer',
    'shopify developer',
    'landing page',
  ],
  'AI/Automation': [
    'ai developer',
    'machine learning',
    'automation specialist',
    'chatbot developer',
    'ai integration',
    'process automation',
    'rpa developer',
    'ai consultant',
    'data scientist',
    'ai implementation',
  ],
  'CRM/Sales': [
    'crm specialist',
    'salesforce admin',
    'hubspot specialist',
    'sales operations',
    'crm implementation',
    'sales automation',
    'pipeline manager',
    'revenue operations',
    'crm consultant',
    'sales enablement',
  ],
  'Video Production': [
    'video editor',
    'videographer',
    'video production',
    'motion graphics',
    'video marketing',
    'youtube editor',
    'content creator',
    'video animator',
    'commercial video',
    'corporate video',
  ],
  'IT Services': [
    'it support',
    'system administrator',
    'network engineer',
    'it consultant',
    'managed services',
    'cloud engineer',
    'devops engineer',
    'cybersecurity',
    'it manager',
    'tech support',
  ],
}

// US States mapping
const US_STATES: Record<string, string> = {
  'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
  'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
  'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
  'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
  'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
  'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
  'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
  'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
  'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
  'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
  'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV',
  'Wisconsin': 'WI', 'Wyoming': 'WY',
}

/**
 * Search Indeed for companies hiring in specific service areas
 */
async function searchIndeedHighIntent(
  state: string,
  serviceKeywords: string[],
  maxResults: number = 20
): Promise<HighIntentBusiness[]> {
  const results: HighIntentBusiness[] = []

  try {
    // Build search query with service keywords
    const searchQuery = serviceKeywords.slice(0, 3).join(' OR ')

    console.log(`[HighIntent] Searching Indeed for: "${searchQuery}" in ${state}`)

    const run = await client.actor('misceres/indeed-scraper').call({
      queries: [searchQuery],
      location: state,
      maxResults,
      country: 'US',
    })

    const { items } = await client.dataset(run.defaultDatasetId).listItems()

    items.forEach((item: any, index: number) => {
      if (item.company) {
        results.push({
          id: `indeed-${Date.now()}-${index}`,
          companyName: item.company,
          jobTitle: item.title || 'Unknown Position',
          jobDescription: item.description?.substring(0, 500),
          location: item.location || state,
          source: 'Indeed',
          postedDate: item.postedAt || new Date().toISOString(),
          jobUrl: item.url,
          intentSignal: `Hiring for ${item.title} - needs ${getIntentReason(item.title)}`,
        })
      }
    })

    console.log(`[HighIntent] Indeed returned ${results.length} businesses`)
  } catch (error) {
    console.error('[HighIntent] Indeed search error:', error)
  }

  return results
}

/**
 * Search Upwork for companies posting projects
 */
async function searchUpworkHighIntent(
  serviceKeywords: string[],
  maxResults: number = 20
): Promise<HighIntentBusiness[]> {
  const results: HighIntentBusiness[] = []

  try {
    // Build search query
    const searchQuery = serviceKeywords.slice(0, 2).join(' ')

    console.log(`[HighIntent] Searching Upwork for: "${searchQuery}"`)

    const run = await client.actor('neatrat/upwork-job-scraper').call({
      searchQuery,
      country: 'United States',
      maxResults,
    })

    const { items } = await client.dataset(run.defaultDatasetId).listItems()

    items.forEach((item: any, index: number) => {
      // Extract company name from client info or job
      const companyName = item.client?.name || item.clientName || extractCompanyFromUpwork(item)

      if (companyName && companyName !== 'Unknown') {
        results.push({
          id: `upwork-${Date.now()}-${index}`,
          companyName,
          jobTitle: item.title || 'Project',
          jobDescription: item.description?.substring(0, 500),
          location: item.clientLocation || item.location || 'United States',
          source: 'Upwork',
          postedDate: item.postedDate || new Date().toISOString(),
          jobUrl: item.url,
          budget: item.budget || item.hourlyRate,
          skills: item.skills || [],
          intentSignal: `Posted project: ${item.title} - Budget: ${item.budget || 'Not specified'}`,
        })
      }
    })

    console.log(`[HighIntent] Upwork returned ${results.length} businesses`)
  } catch (error) {
    console.error('[HighIntent] Upwork search error:', error)
  }

  return results
}

/**
 * Search LinkedIn Jobs for companies hiring
 */
async function searchLinkedInHighIntent(
  state: string,
  serviceKeywords: string[],
  maxResults: number = 20
): Promise<HighIntentBusiness[]> {
  const results: HighIntentBusiness[] = []

  try {
    const searchQuery = serviceKeywords.slice(0, 2).join(' ')

    console.log(`[HighIntent] Searching LinkedIn Jobs for: "${searchQuery}" in ${state}`)

    // Use LinkedIn Jobs Scraper
    const run = await client.actor('bebity/linkedin-jobs-scraper').call({
      searchQueries: [searchQuery],
      location: state,
      maxResults,
      proxy: {
        useApifyProxy: true,
      },
    })

    const { items } = await client.dataset(run.defaultDatasetId).listItems()

    items.forEach((item: any, index: number) => {
      if (item.companyName) {
        results.push({
          id: `linkedin-${Date.now()}-${index}`,
          companyName: item.companyName,
          jobTitle: item.title || 'Unknown Position',
          jobDescription: item.description?.substring(0, 500),
          location: item.location || state,
          source: 'LinkedIn',
          postedDate: item.postedAt || item.listedAt || new Date().toISOString(),
          jobUrl: item.jobUrl || item.link,
          companyWebsite: item.companyUrl,
          intentSignal: `LinkedIn hiring: ${item.title} - Company actively recruiting`,
        })
      }
    })

    console.log(`[HighIntent] LinkedIn returned ${results.length} businesses`)
  } catch (error) {
    console.error('[HighIntent] LinkedIn search error:', error)
  }

  return results
}

/**
 * Main function: Search for high-intent businesses across all platforms
 */
export async function searchHighIntentBusinesses(
  state: string,
  industry: string,
  serviceType: string,
  maxResultsPerSource: number = 15
): Promise<HighIntentSearchResult> {
  console.log('\n==========================================')
  console.log('[HighIntent] Starting High-Intent Business Search')
  console.log(`[HighIntent] State: ${state}`)
  console.log(`[HighIntent] Industry: ${industry}`)
  console.log(`[HighIntent] Service Type: ${serviceType}`)
  console.log('==========================================\n')

  // Get service keywords for the selected service type
  const keywords = SERVICE_KEYWORDS[serviceType] || SERVICE_KEYWORDS['Marketing']

  // Add industry-specific context
  const searchKeywords = keywords.map(k => `${k} ${industry}`.trim())

  // Search all platforms in parallel
  const [indeedResults, upworkResults, linkedinResults] = await Promise.allSettled([
    searchIndeedHighIntent(state, searchKeywords, maxResultsPerSource),
    searchUpworkHighIntent(searchKeywords, maxResultsPerSource),
    searchLinkedInHighIntent(state, searchKeywords, maxResultsPerSource),
  ])

  // Collect results
  const allBusinesses: HighIntentBusiness[] = []
  const sources = { indeed: 0, upwork: 0, linkedin: 0 }

  if (indeedResults.status === 'fulfilled') {
    allBusinesses.push(...indeedResults.value)
    sources.indeed = indeedResults.value.length
  }

  if (upworkResults.status === 'fulfilled') {
    allBusinesses.push(...upworkResults.value)
    sources.upwork = upworkResults.value.length
  }

  if (linkedinResults.status === 'fulfilled') {
    allBusinesses.push(...linkedinResults.value)
    sources.linkedin = linkedinResults.value.length
  }

  // Deduplicate by company name (case-insensitive)
  const seen = new Set<string>()
  const uniqueBusinesses = allBusinesses.filter(b => {
    const key = b.companyName.toLowerCase().trim()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  // Sort by posting date (most recent first)
  uniqueBusinesses.sort((a, b) =>
    new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
  )

  // Calculate credits used (1 credit per source searched)
  const creditsUsed = 3 // Always 3 sources

  console.log(`\n[HighIntent] Search complete!`)
  console.log(`[HighIntent] Total unique businesses: ${uniqueBusinesses.length}`)
  console.log(`[HighIntent] Sources: Indeed=${sources.indeed}, Upwork=${sources.upwork}, LinkedIn=${sources.linkedin}`)
  console.log(`[HighIntent] Credits used: ${creditsUsed}\n`)

  return {
    businesses: uniqueBusinesses,
    searchedAt: new Date().toISOString(),
    query: { state, industry, serviceType },
    sources,
    creditsUsed,
  }
}

// Helper functions

function extractCompanyFromUpwork(item: any): string {
  // Try to extract company from various Upwork fields
  if (item.client?.company) return item.client.company
  if (item.clientCompany) return item.clientCompany
  if (item.clientName && item.clientName !== 'Client') return item.clientName
  return 'Unknown'
}

function getIntentReason(jobTitle: string): string {
  const title = jobTitle.toLowerCase()

  if (title.includes('marketing')) return 'marketing services'
  if (title.includes('web') || title.includes('developer')) return 'web development'
  if (title.includes('design')) return 'design services'
  if (title.includes('seo')) return 'SEO services'
  if (title.includes('social')) return 'social media management'
  if (title.includes('video')) return 'video production'
  if (title.includes('ai') || title.includes('automation')) return 'AI/automation solutions'
  if (title.includes('crm') || title.includes('salesforce')) return 'CRM implementation'
  if (title.includes('it') || title.includes('tech')) return 'IT services'

  return 'professional services'
}

/**
 * Get available service types for the search form
 */
export function getServiceTypes(): string[] {
  return Object.keys(SERVICE_KEYWORDS)
}

/**
 * Get list of US states
 */
export function getUSStates(): Array<{ name: string; code: string }> {
  return Object.entries(US_STATES).map(([name, code]) => ({ name, code }))
}
