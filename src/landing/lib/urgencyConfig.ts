// Configuration for urgency elements across the landing page

export const urgencyConfig = {
  // Countdown timer end date (set dynamically in production)
  foundingMemberDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now

  // Scarcity numbers
  totalSpots: 1000,
  currentUsers: 847,
  spotsRemaining: 153,

  // Founding member pricing
  foundingPrice: 149,
  regularPrice: 299,
  savings: 150,

  // Early access waitlist numbers
  earlyAccess: {
    aiOutreach: { total: 200, claimed: 147, remaining: 53 },
    autoSequences: { total: 150, claimed: 112, remaining: 38 },
    triggerAlerts: { total: 100, claimed: 73, remaining: 27 },
  },

  // Social proof metrics
  metrics: {
    totalAgencies: 2847,
    leadsScored: 1200000,
    dealsClosedValue: 47000000,
    avgCloseRate: 23,
    signupsThisWeek: 847,
  },

  // Loss aversion numbers
  lossCalculations: {
    dailyLostRevenue: 157,
    monthlyLostRevenue: 4710,
    hoursWastedPerMonth: 32,
    dealsLostToCompetitors: 5,
  },

  // ROI defaults
  roiDefaults: {
    leadsPerMonth: 100,
    currentCloseRate: 3,
    avgDealValue: 3000,
    monthlyGoal: 30000,
    timePerLead: 20, // minutes
  },

  // Testimonial ROI claims
  testimonialMetrics: {
    avgFirstMonthRevenue: 47000,
    avgTimeToFirstDeal: 8, // days
    avgCloseRateImprovement: 4, // multiplier
  }
}

// Calculate dynamic scarcity (could be connected to real data)
export function getDynamicScarcity() {
  // In production, this would fetch real data
  // For now, return config values with slight randomization
  const variance = Math.floor(Math.random() * 5)
  return {
    spotsRemaining: urgencyConfig.spotsRemaining - variance,
    currentUsers: urgencyConfig.currentUsers + variance,
  }
}

// Calculate potential loss based on user inputs
export function calculateLoss(monthlyDeals: number, avgDealValue: number) {
  const potentialDealsWithIntelligence = monthlyDeals * 3 // Conservative 3x multiplier
  const missedDeals = potentialDealsWithIntelligence - monthlyDeals
  const monthlyLoss = missedDeals * avgDealValue
  const yearlyLoss = monthlyLoss * 12

  return {
    missedDeals,
    monthlyLoss,
    yearlyLoss,
    dailyLoss: monthlyLoss / 30,
  }
}

// Format large numbers
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K`
  }
  return num.toLocaleString()
}

// Format currency
export function formatCurrency(amount: number, compact = false): string {
  if (compact && amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`
  }
  if (compact && amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`
  }
  return `$${amount.toLocaleString()}`
}
