import { useUser } from '@clerk/clerk-react'

export type SubscriptionTier = 'free' | 'pro' | 'agency' | 'enterprise'

export interface TierLimits {
  leadsPerMonth: number
  searchesPerDay: number
  hasIntelligence: boolean
  hasTeamFeatures: boolean
}

export const TIER_LIMITS: Record<SubscriptionTier, TierLimits> = {
  free: {
    leadsPerMonth: 100,
    searchesPerDay: 10,
    hasIntelligence: false,
    hasTeamFeatures: false,
  },
  pro: {
    leadsPerMonth: 1000,
    searchesPerDay: 50,
    hasIntelligence: true,
    hasTeamFeatures: false,
  },
  agency: {
    leadsPerMonth: 5000,
    searchesPerDay: 200,
    hasIntelligence: true,
    hasTeamFeatures: true,
  },
  enterprise: {
    leadsPerMonth: Infinity,
    searchesPerDay: Infinity,
    hasIntelligence: true,
    hasTeamFeatures: true,
  },
}

export function useSubscription() {
  const { user, isLoaded } = useUser()

  // DEMO MODE: Check localStorage for mock subscription tier first
  const mockTier = typeof window !== 'undefined'
    ? (localStorage.getItem('mockSubscriptionTier') as SubscriptionTier | null)
    : null

  // Use mock tier if exists, otherwise get from Clerk user metadata
  // Default to 'free' if not set
  const tier = mockTier || (user?.publicMetadata?.subscriptionTier as SubscriptionTier) || 'free'
  const limits = TIER_LIMITS[tier]

  // Get usage from metadata (you'd track this server-side typically)
  const usage = {
    leadsThisMonth: (user?.publicMetadata?.leadsThisMonth as number) || 0,
    searchesToday: (user?.publicMetadata?.searchesToday as number) || 0,
  }

  const canSearch = usage.searchesToday < limits.searchesPerDay
  const canDiscoverLeads = usage.leadsThisMonth < limits.leadsPerMonth
  const hasProFeatures = limits.hasIntelligence

  const remainingSearches = Math.max(0, limits.searchesPerDay - usage.searchesToday)
  const remainingLeads = Math.max(0, limits.leadsPerMonth - usage.leadsThisMonth)

  return {
    tier,
    limits,
    usage,
    canSearch,
    canDiscoverLeads,
    hasProFeatures,
    remainingSearches,
    remainingLeads,
    isLoaded,
    isPro: tier !== 'free',
    isAgency: tier === 'agency' || tier === 'enterprise',
    isEnterprise: tier === 'enterprise',
  }
}
