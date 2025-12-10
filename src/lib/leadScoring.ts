import type { Lead, ScoreBreakdown, Opportunity, GrowthSignal } from '@/types'

// Technology categories and their typical monthly values
const TECHNOLOGY_VALUES: Record<string, { monthly: number; category: string }> = {
  // CRM Systems
  'salesforce': { monthly: 150, category: 'CRM' },
  'hubspot': { monthly: 50, category: 'CRM' },
  'zoho': { monthly: 30, category: 'CRM' },
  'pipedrive': { monthly: 25, category: 'CRM' },

  // Email Marketing
  'mailchimp': { monthly: 30, category: 'Email Marketing' },
  'klaviyo': { monthly: 45, category: 'Email Marketing' },
  'sendgrid': { monthly: 20, category: 'Email Marketing' },
  'constant-contact': { monthly: 25, category: 'Email Marketing' },

  // Chat/Support
  'intercom': { monthly: 75, category: 'Chat/Support' },
  'zendesk': { monthly: 55, category: 'Chat/Support' },
  'drift': { monthly: 50, category: 'Chat/Support' },
  'freshdesk': { monthly: 35, category: 'Chat/Support' },

  // Analytics
  'google-analytics': { monthly: 0, category: 'Analytics' },
  'mixpanel': { monthly: 25, category: 'Analytics' },
  'amplitude': { monthly: 50, category: 'Analytics' },
  'hotjar': { monthly: 30, category: 'Analytics' },

  // E-commerce
  'shopify': { monthly: 30, category: 'E-commerce' },
  'woocommerce': { monthly: 0, category: 'E-commerce' },
  'bigcommerce': { monthly: 30, category: 'E-commerce' },

  // Marketing Automation
  'marketo': { monthly: 1000, category: 'Marketing Automation' },
  'pardot': { monthly: 1250, category: 'Marketing Automation' },
  'activecampaign': { monthly: 50, category: 'Marketing Automation' },
}

// Essential tools that businesses should have
const ESSENTIAL_CATEGORIES = ['CRM', 'Email Marketing', 'Analytics']

// Tools that indicate growth potential
const GROWTH_INDICATORS = ['Marketing Automation', 'Chat/Support']

export interface EnrichmentData {
  technologies: string[]
  domainAge?: number // years
  performanceScore?: number // 0-100
  isMobileFriendly?: boolean
  socialFollowers?: {
    instagram?: number
    facebook?: number
    linkedin?: number
    twitter?: number
  }
  lastWebsiteUpdate?: string
}

export interface TechnologyInfo {
  name: string
  category: string
  detected: boolean
}

export interface ScoringResult {
  totalScore: number
  breakdown: ScoreBreakdown
  opportunities: Opportunity[]
  growthSignals: GrowthSignal[]
  insights: string[]
  pitchRecommendation: string
  technologies: TechnologyInfo[]
  enrichmentData?: EnrichmentData
}

/**
 * Calculate lead score based on enrichment data
 * Total possible score: 100 points
 * - Technology Gaps: 40 points max
 * - Growth Signals: 30 points max
 * - Budget Signals: 20 points max
 * - Timing Signals: 10 points max
 */
export function calculateLeadScore(
  lead: Lead,
  enrichmentData: EnrichmentData
): ScoringResult {
  const breakdown: ScoreBreakdown = {
    technologyGaps: 0,
    growthSignals: 0,
    budgetSignals: 0,
    timingSignals: 0,
  }

  const opportunities: Opportunity[] = []
  const growthSignals: GrowthSignal[] = []
  const insights: string[] = []

  // === TECHNOLOGY GAP ANALYSIS (40 points max) ===
  const { technologyScore, techOpportunities, techInsights } = analyzeTechnologyGaps(
    enrichmentData.technologies
  )
  breakdown.technologyGaps = Math.min(40, technologyScore)
  opportunities.push(...techOpportunities)
  insights.push(...techInsights)

  // === GROWTH SIGNALS (30 points max) ===
  const { growthScore, signals, growthInsights } = analyzeGrowthSignals(enrichmentData)
  breakdown.growthSignals = Math.min(30, growthScore)
  growthSignals.push(...signals)
  insights.push(...growthInsights)

  // === BUDGET SIGNALS (20 points max) ===
  const { budgetScore, budgetInsights } = analyzeBudgetSignals(lead, enrichmentData)
  breakdown.budgetSignals = Math.min(20, budgetScore)
  insights.push(...budgetInsights)

  // === TIMING SIGNALS (10 points max) ===
  const { timingScore, timingInsights } = analyzeTimingSignals(enrichmentData)
  breakdown.timingSignals = Math.min(10, timingScore)
  insights.push(...timingInsights)

  const totalScore =
    breakdown.technologyGaps +
    breakdown.growthSignals +
    breakdown.budgetSignals +
    breakdown.timingSignals

  const pitchRecommendation = generatePitchRecommendation(
    lead,
    opportunities,
    growthSignals,
    totalScore
  )

  // Build technology info from enrichment data
  const technologyInfo: TechnologyInfo[] = enrichmentData.technologies.map((tech) => {
    const techLower = tech.toLowerCase()
    let category = 'Other'
    Object.entries(TECHNOLOGY_VALUES).forEach(([key, value]) => {
      if (techLower.includes(key)) {
        category = value.category
      }
    })
    return { name: tech, category, detected: true }
  })

  // Add missing essential categories as "not detected"
  ESSENTIAL_CATEGORIES.forEach((cat) => {
    const hasCategory = technologyInfo.some((t) => t.category === cat)
    if (!hasCategory) {
      technologyInfo.push({ name: cat, category: cat, detected: false })
    }
  })

  return {
    totalScore,
    breakdown,
    opportunities,
    growthSignals,
    insights,
    pitchRecommendation,
    technologies: technologyInfo,
    enrichmentData,
  }
}

function analyzeTechnologyGaps(technologies: string[]): {
  technologyScore: number
  techOpportunities: Opportunity[]
  techInsights: string[]
} {
  let score = 0
  const opportunities: Opportunity[] = []
  const insights: string[] = []

  const detectedCategories = new Set<string>()

  // Map detected technologies to categories
  technologies.forEach((tech) => {
    const techLower = tech.toLowerCase()
    Object.entries(TECHNOLOGY_VALUES).forEach(([key, value]) => {
      if (techLower.includes(key)) {
        detectedCategories.add(value.category)
      }
    })
  })

  // Check for missing essential categories
  ESSENTIAL_CATEGORIES.forEach((category) => {
    if (!detectedCategories.has(category)) {
      score += 12 // ~36 points for all 3 missing

      // Add opportunity based on category
      const avgValue = getAverageCategoryValue(category)
      opportunities.push({
        tool: category,
        value: avgValue,
        description: `No ${category} solution detected`,
      })

      insights.push(`Missing ${category} - high opportunity for your services`)
    }
  })

  // Check for growth opportunity categories
  GROWTH_INDICATORS.forEach((category) => {
    if (!detectedCategories.has(category)) {
      score += 2
      opportunities.push({
        tool: category,
        value: getAverageCategoryValue(category),
        description: `Could benefit from ${category}`,
      })
    }
  })

  // Bonus for outdated tech (detected but old versions)
  if (technologies.some((t) => t.toLowerCase().includes('wordpress') && !technologies.some((t) => t.includes('5.')))) {
    score += 4
    insights.push('Potentially outdated website platform')
  }

  return { technologyScore: score, techOpportunities: opportunities, techInsights: insights }
}

function analyzeGrowthSignals(_enrichmentData: EnrichmentData): {
  growthScore: number
  signals: GrowthSignal[]
  growthInsights: string[]
} {
  // Growth signals analysis simplified for local businesses
  // Future: Could add signals like new location openings, seasonal hiring, etc.
  return { growthScore: 0, signals: [], growthInsights: [] }
}

function analyzeBudgetSignals(lead: Lead, enrichmentData: EnrichmentData): {
  budgetScore: number
  budgetInsights: string[]
} {
  let score = 0
  const insights: string[] = []

  // Website quality indicates budget
  if (enrichmentData.performanceScore) {
    if (enrichmentData.performanceScore >= 80) {
      score += 5
      insights.push('High-quality website suggests budget availability')
    } else if (enrichmentData.performanceScore < 50) {
      score += 8
      insights.push('Poor website performance - may need help')
    }
  }

  // Social presence indicates marketing budget
  if (enrichmentData.socialFollowers) {
    const totalFollowers = Object.values(enrichmentData.socialFollowers).reduce(
      (sum, val) => sum + (val || 0),
      0
    )
    if (totalFollowers > 10000) {
      score += 5
      insights.push('Strong social presence - invests in marketing')
    }
  }

  // Google rating and reviews
  if (lead.googleRating && lead.reviewCount) {
    if (lead.googleRating >= 4.0 && lead.reviewCount >= 50) {
      score += 5
      insights.push('Strong reputation - likely values customer experience')
    }
  }

  // Multiple locations/established business
  if (enrichmentData.domainAge && enrichmentData.domainAge >= 3) {
    score += 5
    insights.push(`Established business (${enrichmentData.domainAge}+ years)`)
  }

  return { budgetScore: score, budgetInsights: insights }
}

function analyzeTimingSignals(enrichmentData: EnrichmentData): {
  timingScore: number
  timingInsights: string[]
} {
  let score = 0
  const insights: string[] = []

  // Recent website changes
  if (enrichmentData.lastWebsiteUpdate) {
    const lastUpdate = new Date(enrichmentData.lastWebsiteUpdate)
    const monthsAgo = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24 * 30)

    if (monthsAgo <= 3) {
      score += 5
      insights.push('Recently updated website - actively investing')
    }
  }

  // Mobile-friendliness
  if (enrichmentData.isMobileFriendly === false) {
    score += 3
    insights.push('Not mobile-friendly - urgent need for updates')
  }

  // Domain age sweet spot (2-10 years)
  if (enrichmentData.domainAge) {
    if (enrichmentData.domainAge >= 2 && enrichmentData.domainAge <= 10) {
      score += 2
      insights.push('Optimal business maturity stage')
    }
  }

  return { timingScore: score, timingInsights: insights }
}

function getAverageCategoryValue(category: string): number {
  const categoryTools = Object.values(TECHNOLOGY_VALUES).filter(
    (t) => t.category === category
  )
  if (categoryTools.length === 0) return 50

  const sum = categoryTools.reduce((acc, t) => acc + t.monthly, 0)
  return Math.round(sum / categoryTools.length)
}

function generatePitchRecommendation(
  lead: Lead,
  opportunities: Opportunity[],
  _growthSignals: GrowthSignal[],
  _score: number
): string {
  const topOpportunity = opportunities.sort((a, b) => b.value - a.value)[0]

  let pitch = `Hi! I noticed ${lead.businessName}`

  if (topOpportunity) {
    pitch += ` doesn't seem to have a ${topOpportunity.tool} solution in place`
  }

  pitch += `. I help businesses like yours `

  if (topOpportunity?.tool === 'CRM') {
    pitch += 'streamline their sales process and close more deals'
  } else if (topOpportunity?.tool === 'Email Marketing') {
    pitch += 'build stronger customer relationships through targeted email campaigns'
  } else if (topOpportunity?.tool === 'Chat/Support') {
    pitch += 'provide better customer support and increase conversions'
  } else {
    pitch += 'grow with the right technology stack'
  }

  pitch += '. Would you be open to a quick chat?'

  return pitch
}

/**
 * Get lead category based on score
 */
export function getLeadCategory(score: number): 'hot' | 'warm' | 'cold' | 'low' {
  if (score >= 70) return 'hot'
  if (score >= 50) return 'warm'
  if (score >= 30) return 'cold'
  return 'low'
}

/**
 * Calculate total opportunity value
 */
export function calculateOpportunityValue(opportunities: Opportunity[]): {
  monthly: number
  yearly: number
} {
  const monthly = opportunities.reduce((sum, opp) => sum + opp.value, 0)
  return {
    monthly,
    yearly: monthly * 12,
  }
}

// Service pricing range for review automation services
const SERVICE_PRICE_MIN = 500 // $500/month
const SERVICE_PRICE_MAX = 1000 // $1000/month
const SERVICE_PRICE_AVG = (SERVICE_PRICE_MIN + SERVICE_PRICE_MAX) / 2 // $750/month

/**
 * Calculate review-based opportunity score
 * Low stars and low reviews = high opportunity for review automation services
 * Returns a score from 0-100 and an estimated lead value
 */
export function calculateReviewOpportunity(
  googleRating: number | undefined | null,
  reviewCount: number | undefined | null
): {
  score: number
  leadValue: number
  opportunityLevel: 'high' | 'medium' | 'low' | 'none'
  reason: string
} {
  // Default values if no data
  if (!googleRating && !reviewCount) {
    return {
      score: 50,
      leadValue: SERVICE_PRICE_AVG,
      opportunityLevel: 'medium',
      reason: 'No review data - potential opportunity'
    }
  }

  let score = 0
  const reasons: string[] = []

  // Rating-based scoring (lower is better for our service)
  // Missing rating = opportunity
  if (!googleRating) {
    score += 40
    reasons.push('No Google rating')
  } else if (googleRating < 3.0) {
    score += 50
    reasons.push('Very low rating - urgent need')
  } else if (googleRating < 3.5) {
    score += 40
    reasons.push('Below average rating')
  } else if (googleRating < 4.0) {
    score += 30
    reasons.push('Room for improvement')
  } else if (googleRating < 4.5) {
    score += 15
    reasons.push('Good but could be better')
  } else {
    score += 5
    reasons.push('Excellent rating')
  }

  // Review count scoring (fewer reviews = more opportunity)
  if (!reviewCount || reviewCount === 0) {
    score += 50
    reasons.push('No reviews')
  } else if (reviewCount < 10) {
    score += 45
    reasons.push('Very few reviews')
  } else if (reviewCount < 25) {
    score += 35
    reasons.push('Low review count')
  } else if (reviewCount < 50) {
    score += 25
    reasons.push('Moderate reviews')
  } else if (reviewCount < 100) {
    score += 15
    reasons.push('Decent review count')
  } else {
    score += 5
    reasons.push('Strong review presence')
  }

  // Cap at 100
  score = Math.min(100, score)

  // Calculate lead value based on score
  // Higher score = higher value (more likely to need our service)
  // Scale from $500 (low opportunity) to $1000 (high opportunity)
  const valueMultiplier = score / 100
  const leadValue = Math.round(
    SERVICE_PRICE_MIN + (SERVICE_PRICE_MAX - SERVICE_PRICE_MIN) * valueMultiplier
  )

  // Determine opportunity level
  let opportunityLevel: 'high' | 'medium' | 'low' | 'none'
  if (score >= 70) {
    opportunityLevel = 'high'
  } else if (score >= 45) {
    opportunityLevel = 'medium'
  } else if (score >= 20) {
    opportunityLevel = 'low'
  } else {
    opportunityLevel = 'none'
  }

  return {
    score,
    leadValue,
    opportunityLevel,
    reason: reasons.join(', ')
  }
}

/**
 * Calculate pipeline potential value for a list of leads
 * Based on review automation service pricing ($500-$1000/mo)
 * Assumes 1% close rate
 */
export function calculatePipelinePotential(
  leads: Array<{ googleRating?: number | null; reviewCount?: number | null }>
): {
  totalLeads: number
  totalPipelineValue: number
  avgLeadValue: number
  expectedCloses: number
  monthlyPotential: number
  closeRate: number
} {
  const CLOSE_RATE = 0.01 // 1% close rate

  if (leads.length === 0) {
    return {
      totalLeads: 0,
      totalPipelineValue: 0,
      avgLeadValue: 0,
      expectedCloses: 0,
      monthlyPotential: 0,
      closeRate: CLOSE_RATE
    }
  }

  // Calculate individual lead values based on review opportunity
  const leadValues = leads.map(lead =>
    calculateReviewOpportunity(lead.googleRating, lead.reviewCount).leadValue
  )

  const totalPipelineValue = leadValues.reduce((sum, val) => sum + val, 0)
  const avgLeadValue = Math.round(totalPipelineValue / leads.length)
  const expectedCloses = Math.max(1, Math.round(leads.length * CLOSE_RATE))
  const monthlyPotential = Math.round(expectedCloses * avgLeadValue)

  return {
    totalLeads: leads.length,
    totalPipelineValue,
    avgLeadValue,
    expectedCloses,
    monthlyPotential,
    closeRate: CLOSE_RATE
  }
}

/**
 * Convert backend enrichment result to frontend EnrichmentData format
 */
export function convertEnrichmentResult(result: {
  technologies?: Array<{ name: string; category: string }>
  websiteAnalysis?: { performanceScore: number; isMobileFriendly: boolean } | null
  domainInfo?: { age: number } | null
  socialMetrics?: {
    instagram?: { followers: number; following: number; mediaCount: number; isBusiness: boolean }
    facebook?: { rating?: number; reviewCount?: number; likes?: number; followers?: number }
    yelp?: { rating: number; reviewCount: number }
  } | null
}): EnrichmentData {
  return {
    technologies: result.technologies?.map(t => t.name) || [],
    domainAge: result.domainInfo?.age,
    performanceScore: result.websiteAnalysis?.performanceScore,
    isMobileFriendly: result.websiteAnalysis?.isMobileFriendly,
    socialFollowers: result.socialMetrics ? {
      instagram: result.socialMetrics.instagram?.followers,
      facebook: result.socialMetrics.facebook?.followers,
    } : undefined,
  }
}
