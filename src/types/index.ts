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
  instagram?: string
  facebook?: string
  linkedin?: string
  twitter?: string
  googleRating?: number
  reviewCount?: number
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
  notes?: string
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
