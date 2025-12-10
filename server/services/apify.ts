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
  tiktok?: string
  youtube?: string
  googleRating?: number
  reviewCount?: number
  yelpRating?: number
  yelpReviewCount?: number
  facebookRating?: number
  facebookReviewCount?: number
  instagramMetrics?: {
    followers: number
    following: number
    mediaCount: number
    isBusiness: boolean
  }
  techSignals?: {
    hasFacebookPixel: boolean
    hasSchema: boolean
    hasGoogleRemarketing: boolean
    hasGoogleAnalytics: boolean
    hasLinkedInAnalytics: boolean
    usesWordPress: boolean
    usesShopify: boolean
    isMobileFriendly: boolean
  }
  emailVerified?: boolean
  emailVerificationScore?: number
  emailVerificationStatus?: string
  businessHours?: Record<string, string>
  photos?: string[]
}

interface SearchOptions {
  searchQuery: string
}

// Helper to extract social URL from various possible response formats
function extractSocialUrl(item: any, platform: string, socialUrls: any): string | undefined {
  // Map platform names to the plural array field names that Apify actually returns
  const pluralFieldMap: Record<string, string> = {
    instagram: 'instagrams',
    facebook: 'facebooks',
    linkedin: 'linkedIns',
    twitter: 'twitters',
    youtube: 'youtubes',
    tiktok: 'tiktoks',
  }

  // Check plural array fields first (this is what Apify actually returns!)
  const pluralField = pluralFieldMap[platform]
  if (pluralField && Array.isArray(item[pluralField]) && item[pluralField].length > 0) {
    return item[pluralField][0] // Return first URL from the array
  }

  // Direct field on item (singular)
  if (item[platform]) return item[platform]

  // From socialUrls object (can be named differently)
  if (socialUrls?.[platform]) return socialUrls[platform]

  // Handle 'x' alias for twitter
  if (platform === 'twitter') {
    if (item.x) return item.x
    if (socialUrls?.x) return socialUrls.x
    // Also check for x.com URLs in twitters array
    if (Array.isArray(item.twitters)) {
      const xUrl = item.twitters.find((u: string) =>
        typeof u === 'string' && u.toLowerCase().includes('x.com')
      )
      if (xUrl) return xUrl
    }
  }

  // From array format (array of URL strings)
  const arrayFields = ['socialMediaUrls', 'socialUrls', 'socials']
  for (const field of arrayFields) {
    if (Array.isArray(item[field])) {
      const url = item[field].find((u: string) =>
        typeof u === 'string' && u.toLowerCase().includes(platform)
      )
      if (url) return url
      // Also check for 'x.com' for twitter
      if (platform === 'twitter') {
        const xUrl = item[field].find((u: string) =>
          typeof u === 'string' && u.toLowerCase().includes('x.com')
        )
        if (xUrl) return xUrl
      }
    }
  }

  // Check nested contacts object (some Apify actors use this)
  if (item.contacts?.socials?.[platform]) {
    return item.contacts.socials[platform]
  }
  if (item.contactInfo?.socials?.[platform]) {
    return item.contactInfo.socials[platform]
  }

  return undefined
}

export async function searchLeads(options: SearchOptions): Promise<Lead[]> {
  const { searchQuery } = options

  console.log('[Apify] Starting Google Maps search:', searchQuery)

  // Run the official Google Maps Scraper actor (compass/crawler-google-places)
  // With full contact and social media enrichment enabled
  const run = await client.actor('compass/crawler-google-places').call({
    searchStringsArray: [searchQuery],
    // TESTING: Limit to 20 results to reduce costs
    maxCrawledPlacesPerSearch: 20,
    language: 'en',
    deeperCityScrape: false, // Disabled for testing to reduce costs
    skipClosedPlaces: true,
    // Only scrape places that have a website (required for contact enrichment)
    onlyPlacesWithUrl: true,
    // Enable contact enrichment from website
    scrapeContacts: true,
    // Enable social media profile enrichment
    scrapeSocial: true,
    // Contact enrichment options
    scrapeEmails: true,
    scrapePhones: true,
    // Social media platforms to scrape
    scrapeFacebook: true,
    scrapeInstagram: true,
    scrapeYoutube: true,
    scrapeTiktok: true,
    scrapeTwitter: true,
    scrapeLinkedin: true,
  })

  console.log('[Apify] Run started, waiting for results...')

  // Wait for the run to finish and get results
  const { items } = await client.dataset(run.defaultDatasetId).listItems()

  console.log('[Apify] Found', items.length, 'businesses')

  // Log sample item to debug field names - comprehensive logging to identify actual structure
  if (items.length > 0) {
    const sampleItem = items[0]
    console.log('[Apify] Sample item keys:', Object.keys(sampleItem))
    console.log('[Apify] Sample social data:', JSON.stringify({
      // All possible social URL object names
      socialUrls: sampleItem.socialUrls,
      socialMediaUrls: sampleItem.socialMediaUrls,
      socialProfiles: sampleItem.socialProfiles,
      socials: sampleItem.socials,
      // Direct social fields
      instagram: sampleItem.instagram,
      facebook: sampleItem.facebook,
      linkedin: sampleItem.linkedin,
      twitter: sampleItem.twitter,
      tiktok: sampleItem.tiktok,
      youtube: sampleItem.youtube,
      // Contact-related fields
      email: sampleItem.email,
      emails: sampleItem.emails,
      contactInfo: sampleItem.contactInfo,
      contacts: sampleItem.contacts,
    }, null, 2))
    // Log full sample item for complete visibility
    console.log('[Apify] Full sample item:', JSON.stringify(sampleItem, null, 2))
  }

  // Transform the results to our Lead format
  // The scraper returns contact and social data in various formats
  const allLeads: Lead[] = items.map((item: any, index: number) => {
    // Extract email - check multiple possible field names
    const email = item.email ||
                  item.emails?.[0] ||
                  item.contactInfo?.email ||
                  item.contactInfo?.emails?.[0] ||
                  ''

    // Extract social media - check all possible object names the actor might use
    const socialUrls = item.socialUrls || item.socialMediaUrls || item.socialProfiles || item.socials || {}

    // Extract social media URLs
    const instagram = extractSocialUrl(item, 'instagram', socialUrls)
    const facebook = extractSocialUrl(item, 'facebook', socialUrls)
    const linkedin = extractSocialUrl(item, 'linkedin', socialUrls)
    const twitter = extractSocialUrl(item, 'twitter', socialUrls)
    const tiktok = extractSocialUrl(item, 'tiktok', socialUrls)
    const youtube = extractSocialUrl(item, 'youtube', socialUrls)

    // Log social media extraction for first few items
    if (index < 3) {
      console.log(`[Apify] Social extraction for "${item.title}":`, {
        rawArrays: {
          instagrams: item.instagrams,
          facebooks: item.facebooks,
          linkedIns: item.linkedIns,
          twitters: item.twitters,
          youtubes: item.youtubes,
          tiktoks: item.tiktoks,
        },
        extracted: { instagram, facebook, linkedin, twitter, tiktok, youtube }
      })
    }

    return {
      id: `lead-${Date.now()}-${index}`,
      businessName: item.title || item.name || 'Unknown Business',
      category: item.categoryName || item.categories?.[0] || 'Business',
      address: item.address || item.street || '',
      city: extractCity(item.address) || item.city || '',
      state: extractState(item.address) || item.state || '',
      zip: item.postalCode || item.zip || '',
      country: item.country || 'USA',
      phone: item.phone || item.phoneNumber || item.contactInfo?.phone || '',
      email,
      website: item.website || item.url || '',
      // Social profiles - already extracted above
      instagram,
      facebook,
      linkedin,
      twitter,
      tiktok,
      youtube,
      googleRating: item.totalScore || item.rating || null,
      reviewCount: item.reviewsCount || item.reviews || 0,
      businessHours: item.openingHours || {},
      photos: item.imageUrls || item.photos || [],
    }
  })

  // Helper to check if lead has any social media profiles
  function hasSocialMedia(lead: any): boolean {
    return Boolean(
      lead.instagram ||
      lead.facebook ||
      lead.linkedin ||
      lead.twitter ||
      lead.tiktok ||
      lead.youtube
    )
  }

  // Filter leads - show if they have email OR social media accounts
  const leads = allLeads.filter(lead => {
    const hasEmail = lead.email && lead.email.trim() !== ''
    const hasSocial = hasSocialMedia(lead)
    return hasEmail || hasSocial
  })

  console.log('[Apify] Leads with contact info (email or social):', leads.length, 'out of', allLeads.length, 'total')

  return leads
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

// Export client for use in other services
export { client as apifyClient }
