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
  employeeCount?: number
  jobPostings?: Array<{ title: string; date: string; source: string }>
  performanceScore?: number // 0-100
  isMobileFriendly?: boolean
  socialFollowers?: {
    instagram?: number
    facebook?: number
    linkedin?: number
    twitter?: number
  }
  lastWebsiteUpdate?: string
  hasRecentFunding?: boolean
  fundingAmount?: number
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

function analyzeGrowthSignals(enrichmentData: EnrichmentData): {
  growthScore: number
  signals: GrowthSignal[]
  growthInsights: string[]
} {
  let score = 0
  const signals: GrowthSignal[] = []
  const insights: string[] = []

  // Job postings indicate growth
  if (enrichmentData.jobPostings && enrichmentData.jobPostings.length > 0) {
    score += 15

    enrichmentData.jobPostings.forEach((job) => {
      signals.push({
        type: 'job_posting',
        title: job.title,
        date: job.date,
        details: `Posted on ${job.source}`,
      })
    })

    insights.push(`Actively hiring (${enrichmentData.jobPostings.length} open positions)`)
  }

  // Employee count growth
  if (enrichmentData.employeeCount) {
    if (enrichmentData.employeeCount >= 10 && enrichmentData.employeeCount <= 50) {
      score += 8
      insights.push('Sweet spot company size for scaling')
    } else if (enrichmentData.employeeCount >= 50 && enrichmentData.employeeCount <= 200) {
      score += 5
      insights.push('Growing mid-size company')
    }
  }

  // Recent funding
  if (enrichmentData.hasRecentFunding) {
    score += 7
    signals.push({
      type: 'funding',
      title: enrichmentData.fundingAmount
        ? `Raised $${(enrichmentData.fundingAmount / 1000000).toFixed(1)}M`
        : 'Recent funding',
      date: new Date().toISOString(),
      details: 'Has budget for new tools',
    })
    insights.push('Recently funded - likely has budget')
  }

  return { growthScore: score, signals, growthInsights: insights }
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
  growthSignals: GrowthSignal[],
  _score: number
): string {
  const topOpportunity = opportunities.sort((a, b) => b.value - a.value)[0]
  const hasJobPostings = growthSignals.some((s) => s.type === 'job_posting')
  const hasFunding = growthSignals.some((s) => s.type === 'funding')

  let pitch = `Hi! I noticed ${lead.businessName}`

  if (topOpportunity) {
    pitch += ` doesn't seem to have a ${topOpportunity.tool} solution in place`
  }

  if (hasJobPostings) {
    pitch += `, and I see you're growing your team`
  }

  if (hasFunding) {
    pitch += `. Congrats on the recent funding`
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

/**
 * Convert backend enrichment result to frontend EnrichmentData format
 */
export function convertEnrichmentResult(result: {
  technologies?: Array<{ name: string; category: string }>
  jobPostings?: Array<{ title: string; date: string; source: string }>
  websiteAnalysis?: { performanceScore: number; isMobileFriendly: boolean } | null
  domainInfo?: { age: number } | null
  employeeCount?: number | null
  fundingInfo?: { hasRecentFunding: boolean; amount?: number } | null
  socialMetrics?: {
    instagram?: { followers: number; following: number; mediaCount: number; isBusiness: boolean }
    facebook?: { rating?: number; reviewCount?: number; likes?: number; followers?: number }
    yelp?: { rating: number; reviewCount: number }
  } | null
}): EnrichmentData {
  return {
    technologies: result.technologies?.map(t => t.name) || [],
    domainAge: result.domainInfo?.age,
    employeeCount: result.employeeCount ?? undefined,
    jobPostings: result.jobPostings || [],
    performanceScore: result.websiteAnalysis?.performanceScore,
    isMobileFriendly: result.websiteAnalysis?.isMobileFriendly,
    hasRecentFunding: result.fundingInfo?.hasRecentFunding || false,
    fundingAmount: result.fundingInfo?.amount,
    socialFollowers: result.socialMetrics ? {
      instagram: result.socialMetrics.instagram?.followers,
      facebook: result.socialMetrics.facebook?.followers,
    } : undefined,
  }
}
