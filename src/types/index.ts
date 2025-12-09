// Lead types
export interface Lead {
  id: string
  businessName: string
  category: string
  address?: string
  city: string
  state: string
  zip?: string
  country?: string
  phone?: string
  email?: string
  website?: string

  // Social media links
  instagram?: string
  facebook?: string
  linkedin?: string
  twitter?: string
  tiktok?: string
  youtube?: string

  // Email verification
  emailVerified?: boolean
  emailVerificationScore?: number
  emailVerificationStatus?: 'valid' | 'invalid' | 'catchall' | 'disposable' | 'unknown'

  // Google reviews
  googleRating?: number
  reviewCount?: number

  // Yelp data
  yelpRating?: number
  yelpReviewCount?: number

  // Facebook page data
  facebookRating?: number
  facebookReviewCount?: number

  // Instagram metrics
  instagramMetrics?: {
    followers: number
    following: number
    mediaCount: number
    isBusiness: boolean
    profileUrl?: string
  }

  // Facebook page metrics
  facebookMetrics?: {
    rating?: number
    reviewCount?: number
    likes?: number
    followers?: number
    pageUrl?: string
  }

  // LinkedIn company metrics
  linkedinMetrics?: {
    followers: number
    employeeCount?: number
    companyUrl: string
  }

  // Twitter metrics
  twitterMetrics?: {
    followers: number
    following: number
    tweets: number
    profileUrl: string
    verified?: boolean
  }

  // TikTok metrics
  tiktokMetrics?: {
    followers: number
    likes: number
    videos: number
    profileUrl: string
  }

  // YouTube metrics
  youtubeMetrics?: {
    subscribers: number
    videos: number
    views: number
    channelUrl: string
  }

  // Technology signals
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

  businessHours?: Record<string, string>
  photos?: string[]

  // Intelligence (Pro)
  leadScore?: number
  scoreBreakdown?: ScoreBreakdown
  technologies?: string[]
  opportunities?: Opportunity[]
  growthSignals?: GrowthSignal[]

  // CRM
  stage?: PipelineStage
  tags?: string[]
  notes?: string[]
  lastContactedAt?: string
  lastContactMethod?: ContactMethod
  nextFollowUpAt?: string
}

export interface ScoreBreakdown {
  technologyGaps: number
  growthSignals: number
  budgetSignals: number
  timingSignals: number
}

export interface Opportunity {
  tool: string
  value: number
  description?: string
}

export interface GrowthSignal {
  type: 'job_posting' | 'website_change' | 'funding' | 'expansion'
  title: string
  date: string
  details?: string
}

export type PipelineStage =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'won'
  | 'lost'

export type ContactMethod =
  | 'email'
  | 'phone'
  | 'instagram'
  | 'facebook'
  | 'linkedin'
  | 'twitter'
  | 'website'
  | 'in_person'

export type LeadCategory = 'hot' | 'warm' | 'cold' | 'low'

// Search types
export interface SearchFilters {
  category: string
  location: string
  minRating?: number
  hasWebsite?: boolean
  hasEmail?: boolean
}

export interface SearchResult {
  leads: Lead[]
  count: number
  cached: boolean
  searchId?: string
}

// User types
export type SubscriptionTier = 'free' | 'pro' | 'agency' | 'enterprise'

export interface User {
  id: string
  email: string
  name?: string
  subscriptionTier: SubscriptionTier
  createdAt: string
}

// Activity types
export interface LeadActivity {
  id: string
  leadId: string
  userId: string
  activityType: ActivityType
  contactMethod?: ContactMethod
  details?: Record<string, any>
  createdAt: string
}

export type ActivityType =
  | 'contacted'
  | 'note_added'
  | 'stage_changed'
  | 'tag_added'
  | 'follow_up_scheduled'
  | 'enriched'
