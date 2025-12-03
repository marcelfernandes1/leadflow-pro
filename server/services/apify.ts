import { ApifyClient } from 'apify-client'

const client = new ApifyClient({
  token: process.env.APIFY_API_TOKEN,
})

export interface Lead {
  id: string
  businessName: string
  category: string
  address: string
  city: string
  state: string
  zip?: string
  country?: string
  phone?: string
  email?: string
  website?: string
  instagram?: string
  facebook?: string
  linkedin?: string
  twitter?: string
  googleRating?: number
  reviewCount?: number
  businessHours?: Record<string, string>
  photos?: string[]
}

interface SearchOptions {
  searchQuery: string
  maxResults?: number
  minRating?: number
}

export async function searchLeads(options: SearchOptions): Promise<Lead[]> {
  const { searchQuery, maxResults = 100, minRating } = options

  try {
    // Run the Google Maps Scraper actor
    const run = await client.actor('dtrungtin/google-maps-scraper').call({
      searchStringsArray: [searchQuery],
      maxCrawledPlaces: maxResults,
      language: 'en',
      includeWebResults: false,
    })

    // Wait for the run to finish and get results
    const { items } = await client.dataset(run.defaultDatasetId).listItems()

    // Transform the results to our Lead format
    const leads: Lead[] = items.map((item: any, index: number) => ({
      id: `lead-${Date.now()}-${index}`,
      businessName: item.title || item.name || 'Unknown Business',
      category: item.categoryName || item.categories?.[0] || 'Business',
      address: item.address || item.street || '',
      city: extractCity(item.address) || item.city || '',
      state: extractState(item.address) || item.state || '',
      zip: item.postalCode || item.zip || '',
      country: item.country || 'USA',
      phone: item.phone || item.phoneNumber || '',
      email: item.email || '',
      website: item.website || item.url || '',
      instagram: extractSocialHandle(item.socialProfiles, 'instagram'),
      facebook: extractSocialHandle(item.socialProfiles, 'facebook'),
      linkedin: extractSocialHandle(item.socialProfiles, 'linkedin'),
      twitter: extractSocialHandle(item.socialProfiles, 'twitter'),
      googleRating: item.totalScore || item.rating || null,
      reviewCount: item.reviewsCount || item.reviews || 0,
      businessHours: item.openingHours || {},
      photos: item.imageUrls || item.photos || [],
    }))

    // Filter by minimum rating if specified
    if (minRating) {
      return leads.filter(
        (lead) => lead.googleRating && lead.googleRating >= minRating
      )
    }

    return leads
  } catch (error) {
    console.error('Error searching leads with Apify:', error)

    // Return mock data for development if API fails
    if (process.env.NODE_ENV === 'development') {
      return generateMockLeads(searchQuery, maxResults)
    }

    throw error
  }
}

// Helper to extract city from address
function extractCity(address: string): string {
  if (!address) return ''
  const parts = address.split(',')
  if (parts.length >= 2) {
    return parts[parts.length - 2].trim()
  }
  return ''
}

// Helper to extract state from address
function extractState(address: string): string {
  if (!address) return ''
  const parts = address.split(',')
  if (parts.length >= 1) {
    const lastPart = parts[parts.length - 1].trim()
    // Extract state code (e.g., "FL 33101" -> "FL")
    const match = lastPart.match(/([A-Z]{2})\s*\d*/)
    return match ? match[1] : ''
  }
  return ''
}

// Helper to extract social media handles
function extractSocialHandle(
  socialProfiles: any,
  platform: string
): string | undefined {
  if (!socialProfiles) return undefined
  if (Array.isArray(socialProfiles)) {
    const profile = socialProfiles.find((p: any) =>
      p.toLowerCase().includes(platform)
    )
    return profile || undefined
  }
  return socialProfiles[platform] || undefined
}

// Generate mock leads for development
function generateMockLeads(searchQuery: string, count: number): Lead[] {
  const [category, location] = searchQuery.split(' in ')
  const city = location?.split(',')[0]?.trim() || 'Miami'
  const state = location?.split(',')[1]?.trim() || 'FL'

  return Array.from({ length: Math.min(count, 20) }, (_, i) => ({
    id: `mock-lead-${Date.now()}-${i}`,
    businessName: `${category?.charAt(0).toUpperCase()}${category?.slice(1) || 'Business'} Pro ${i + 1}`,
    category: category || 'Business',
    address: `${100 + i} Main Street`,
    city,
    state,
    zip: `${33000 + i}`,
    country: 'USA',
    phone: `+1-555-${String(1000 + i).padStart(4, '0')}`,
    email: `contact@business${i + 1}.com`,
    website: `https://business${i + 1}.com`,
    instagram: `@business${i + 1}`,
    facebook: `facebook.com/business${i + 1}`,
    googleRating: 3.5 + Math.random() * 1.5,
    reviewCount: Math.floor(50 + Math.random() * 200),
    businessHours: {
      Monday: '9:00 AM - 5:00 PM',
      Tuesday: '9:00 AM - 5:00 PM',
      Wednesday: '9:00 AM - 5:00 PM',
      Thursday: '9:00 AM - 5:00 PM',
      Friday: '9:00 AM - 5:00 PM',
    },
    photos: [],
  }))
}

// Detect technology stack for a website (Pro feature)
export async function detectTechStack(websiteUrl: string): Promise<string[]> {
  try {
    const run = await client
      .actor('benthepythondev/website-tech-detector')
      .call({
        url: websiteUrl,
      })

    const { items } = await client.dataset(run.defaultDatasetId).listItems()
    return items.flatMap((item: any) => item.technologies || [])
  } catch (error) {
    console.error('Error detecting tech stack:', error)
    return []
  }
}
