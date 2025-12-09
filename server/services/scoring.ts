import type { EnrichmentResult, TechnologyInfo } from './enrichment.js'

// Technology categories and their typical monthly values
const TECHNOLOGY_VALUES: Record<string, { monthly: number; category: string }> = {
  // CRM Systems
  salesforce: { monthly: 150, category: 'CRM' },
  hubspot: { monthly: 50, category: 'CRM' },
  zoho: { monthly: 30, category: 'CRM' },
  pipedrive: { monthly: 25, category: 'CRM' },

  // Email Marketing
  mailchimp: { monthly: 30, category: 'Email Marketing' },
  klaviyo: { monthly: 45, category: 'Email Marketing' },
  sendgrid: { monthly: 20, category: 'Email Marketing' },
  'constant-contact': { monthly: 25, category: 'Email Marketing' },

  // Chat/Support
  intercom: { monthly: 75, category: 'Chat/Support' },
  zendesk: { monthly: 55, category: 'Chat/Support' },
  drift: { monthly: 50, category: 'Chat/Support' },
  freshdesk: { monthly: 35, category: 'Chat/Support' },

  // Analytics
  'google-analytics': { monthly: 0, category: 'Analytics' },
  mixpanel: { monthly: 25, category: 'Analytics' },
  amplitude: { monthly: 50, category: 'Analytics' },
  hotjar: { monthly: 30, category: 'Analytics' },

  // E-commerce
  shopify: { monthly: 30, category: 'E-commerce' },
  woocommerce: { monthly: 0, category: 'E-commerce' },
  bigcommerce: { monthly: 30, category: 'E-commerce' },

  // Marketing Automation
  marketo: { monthly: 1000, category: 'Marketing Automation' },
  pardot: { monthly: 1250, category: 'Marketing Automation' },
  activecampaign: { monthly: 50, category: 'Marketing Automation' },
}

// Essential tools that businesses should have
const ESSENTIAL_CATEGORIES = ['CRM', 'Email Marketing', 'Analytics']

// Tools that indicate growth potential
const GROWTH_INDICATOR_CATEGORIES = ['Marketing Automation', 'Chat/Support']

export interface ScoreBreakdown {
  technologyGaps: number
  reputationSignals: number // Google ratings & reviews - FREE for all users
  growthSignals: number
  budgetSignals: number
  timingSignals: number
}

export interface Opportunity {
  tool: string
  value: number
  description: string
}

export interface GrowthSignal {
  type: 'job_posting' | 'funding' | 'expansion' | 'hiring'
  title: string
  date: string
  details: string
}

export interface ScoringResult {
  totalScore: number
  breakdown: ScoreBreakdown
  opportunities: Opportunity[]
  growthSignals: GrowthSignal[]
  insights: string[]
  pitchRecommendation: string
}

/**
 * Calculate lead score based on enrichment data
 * Total possible score: 100 points
 * - Technology Gaps: 35 points max
 * - Reputation Signals: 15 points max (Google ratings & reviews - FREE for all users)
 * - Growth Signals: 25 points max
 * - Budget Signals: 15 points max
 * - Timing Signals: 10 points max
 */
export function calculateLeadScore(
  enrichment: EnrichmentResult,
  leadInfo: {
    businessName: string
    googleRating?: number
    reviewCount?: number
  }
): ScoringResult {
  const breakdown: ScoreBreakdown = {
    technologyGaps: 0,
    reputationSignals: 0,
    growthSignals: 0,
    budgetSignals: 0,
    timingSignals: 0,
  }

  const opportunities: Opportunity[] = []
  const growthSignals: GrowthSignal[] = []
  const insights: string[] = []

  // === TECHNOLOGY GAP ANALYSIS (35 points max) ===
  const techAnalysis = analyzeTechnologyGaps(enrichment.technologies)
  breakdown.technologyGaps = Math.min(35, techAnalysis.score)
  opportunities.push(...techAnalysis.opportunities)
  insights.push(...techAnalysis.insights)

  // === REPUTATION SIGNALS (15 points max) - FREE for all users ===
  const reputationAnalysis = analyzeReputationSignals(leadInfo)
  breakdown.reputationSignals = Math.min(15, reputationAnalysis.score)
  insights.push(...reputationAnalysis.insights)

  // === GROWTH SIGNALS (25 points max) ===
  const growthAnalysis = analyzeGrowthSignals(enrichment)
  breakdown.growthSignals = Math.min(25, growthAnalysis.score)
  growthSignals.push(...growthAnalysis.signals)
  insights.push(...growthAnalysis.insights)

  // === BUDGET SIGNALS (15 points max) ===
  const budgetAnalysis = analyzeBudgetSignals(enrichment)
  breakdown.budgetSignals = Math.min(15, budgetAnalysis.score)
  insights.push(...budgetAnalysis.insights)

  // === TIMING SIGNALS (10 points max) ===
  const timingAnalysis = analyzeTimingSignals(enrichment)
  breakdown.timingSignals = Math.min(10, timingAnalysis.score)
  insights.push(...timingAnalysis.insights)

  const totalScore =
    breakdown.technologyGaps +
    breakdown.reputationSignals +
    breakdown.growthSignals +
    breakdown.budgetSignals +
    breakdown.timingSignals

  const pitchRecommendation = generatePitchRecommendation(
    leadInfo.businessName,
    opportunities,
    growthSignals,
    totalScore
  )

  return {
    totalScore,
    breakdown,
    opportunities,
    growthSignals,
    insights,
    pitchRecommendation,
  }
}

function analyzeTechnologyGaps(technologies: TechnologyInfo[]): {
  score: number
  opportunities: Opportunity[]
  insights: string[]
} {
  let score = 0
  const opportunities: Opportunity[] = []
  const insights: string[] = []

  const detectedCategories = new Set<string>()

  // Map detected technologies to categories
  technologies.forEach((tech) => {
    detectedCategories.add(tech.category)
  })

  // Check for missing essential categories
  ESSENTIAL_CATEGORIES.forEach((category) => {
    if (!detectedCategories.has(category)) {
      score += 12 // ~36 points for all 3 missing

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
  GROWTH_INDICATOR_CATEGORIES.forEach((category) => {
    if (!detectedCategories.has(category)) {
      score += 2
      opportunities.push({
        tool: category,
        value: getAverageCategoryValue(category),
        description: `Could benefit from ${category}`,
      })
    }
  })

  // Bonus for outdated tech indicators
  const hasWordPress = technologies.some((t) =>
    t.name.toLowerCase().includes('wordpress')
  )
  const hasOldVersions = technologies.some(
    (t) => t.version && parseFloat(t.version) < 5
  )

  if (hasWordPress && hasOldVersions) {
    score += 4
    insights.push('Potentially outdated website platform')
  }

  return { score, opportunities, insights }
}

function analyzeGrowthSignals(enrichment: EnrichmentResult): {
  score: number
  signals: GrowthSignal[]
  insights: string[]
} {
  let score = 0
  const signals: GrowthSignal[] = []
  const insights: string[] = []

  // Job postings indicate growth
  if (enrichment.jobPostings && enrichment.jobPostings.length > 0) {
    score += 15

    enrichment.jobPostings.forEach((job) => {
      signals.push({
        type: 'job_posting',
        title: job.title,
        date: job.date,
        details: `Posted on ${job.source}`,
      })
    })

    insights.push(
      `Actively hiring (${enrichment.jobPostings.length} open positions)`
    )
  }

  // Employee count analysis
  if (enrichment.employeeCount) {
    if (enrichment.employeeCount >= 10 && enrichment.employeeCount <= 50) {
      score += 8
      insights.push('Sweet spot company size for scaling')
    } else if (
      enrichment.employeeCount >= 50 &&
      enrichment.employeeCount <= 200
    ) {
      score += 5
      insights.push('Growing mid-size company')
    }
  }

  // Recent funding
  if (enrichment.fundingInfo?.hasRecentFunding) {
    score += 7
    signals.push({
      type: 'funding',
      title: enrichment.fundingInfo.amount
        ? `Raised $${(enrichment.fundingInfo.amount / 1000000).toFixed(1)}M`
        : 'Recent funding',
      date: enrichment.fundingInfo.date || new Date().toISOString(),
      details: 'Has budget for new tools',
    })
    insights.push('Recently funded - likely has budget')
  }

  return { score, signals, insights }
}

function analyzeBudgetSignals(enrichment: EnrichmentResult): {
  score: number
  insights: string[]
} {
  let score = 0
  const insights: string[] = []

  // Website quality indicates budget
  if (enrichment.websiteAnalysis) {
    const perfScore = enrichment.websiteAnalysis.performanceScore

    if (perfScore >= 80) {
      score += 4
      insights.push('High-quality website suggests budget availability')
    } else if (perfScore < 50) {
      score += 6
      insights.push('Poor website performance - may need help')
    }
  }

  // Domain age (established business)
  if (enrichment.domainInfo && enrichment.domainInfo.age >= 3) {
    score += 4
    insights.push(`Established business (${enrichment.domainInfo.age}+ years)`)
  }

  return { score, insights }
}

function analyzeReputationSignals(leadInfo: {
  googleRating?: number
  reviewCount?: number
}): {
  score: number
  insights: string[]
} {
  let score = 0
  const insights: string[] = []

  const { googleRating, reviewCount } = leadInfo

  // No data = neutral (they might not be on Google Maps)
  if (!googleRating && !reviewCount) {
    return { score: 0, insights: [] }
  }

  // Low rating = HIGH opportunity (they need reputation help)
  if (googleRating !== undefined) {
    if (googleRating < 3.0) {
      score += 8
      insights.push(`Low Google rating (${googleRating}) - strong need for reputation management`)
    } else if (googleRating < 3.5) {
      score += 5
      insights.push(`Below-average Google rating (${googleRating}) - opportunity for improvement`)
    } else if (googleRating < 4.0) {
      score += 3
      insights.push(`Average Google rating (${googleRating}) - room for growth`)
    }
    // 4.0+ rating = they're doing well, less urgent need
  }

  // Few reviews = HIGH opportunity (they need visibility/marketing)
  if (reviewCount !== undefined) {
    if (reviewCount < 10) {
      score += 7
      insights.push(`Very few reviews (${reviewCount}) - needs visibility and marketing`)
    } else if (reviewCount < 25) {
      score += 5
      insights.push(`Low review count (${reviewCount}) - opportunity for review generation`)
    } else if (reviewCount < 50) {
      score += 3
      insights.push(`Moderate reviews (${reviewCount}) - could benefit from more visibility`)
    }
    // 50+ reviews = established presence
  }

  return { score, insights }
}

function analyzeTimingSignals(enrichment: EnrichmentResult): {
  score: number
  insights: string[]
} {
  let score = 0
  const insights: string[] = []

  // Mobile-friendliness
  if (enrichment.websiteAnalysis?.isMobileFriendly === false) {
    score += 3
    insights.push('Not mobile-friendly - urgent need for updates')
  }

  // Domain age sweet spot (2-10 years)
  if (enrichment.domainInfo) {
    if (enrichment.domainInfo.age >= 2 && enrichment.domainInfo.age <= 10) {
      score += 2
      insights.push('Optimal business maturity stage')
    }
  }

  // Recent job postings timing
  if (enrichment.jobPostings && enrichment.jobPostings.length > 0) {
    const recentJobs = enrichment.jobPostings.filter((job) => {
      const jobDate = new Date(job.date)
      const daysAgo =
        (Date.now() - jobDate.getTime()) / (1000 * 60 * 60 * 24)
      return daysAgo <= 14
    })

    if (recentJobs.length > 0) {
      score += 5
      insights.push('Very recent job postings - actively expanding')
    }
  }

  return { score, insights }
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
  businessName: string,
  opportunities: Opportunity[],
  growthSignals: GrowthSignal[],
  _score: number
): string {
  const topOpportunity = opportunities.sort((a, b) => b.value - a.value)[0]
  const hasJobPostings = growthSignals.some((s) => s.type === 'job_posting')
  const hasFunding = growthSignals.some((s) => s.type === 'funding')

  let pitch = `Hi! I noticed ${businessName}`

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
export function getLeadCategory(
  score: number
): 'hot' | 'warm' | 'cold' | 'low' {
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
