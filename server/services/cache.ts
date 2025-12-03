import type { Lead } from './apify.js'

// In-memory cache for development (will use database in production)
interface CacheEntry {
  category: string
  location: string
  leads: Lead[]
  scrapedAt: Date
  lastServedAt: Date
  serveCount: number
}

const cache = new Map<string, CacheEntry>()

const CACHE_TTL_DAYS = 60 // Cache expires after 60 days

function getCacheKey(category: string, location: string): string {
  return `${category.toLowerCase().trim()}::${location.toLowerCase().trim()}`
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function checkCache(
  category: string,
  location: string
): { leads: Lead[]; cached: boolean } | null {
  const key = getCacheKey(category, location)
  const entry = cache.get(key)

  if (!entry) {
    return null
  }

  // Check if cache is still valid (within TTL)
  const now = new Date()
  const ageInDays =
    (now.getTime() - entry.scrapedAt.getTime()) / (1000 * 60 * 60 * 24)

  if (ageInDays > CACHE_TTL_DAYS) {
    // Cache expired, remove it
    cache.delete(key)
    return null
  }

  // Update cache metadata
  entry.lastServedAt = now
  entry.serveCount += 1

  // Return randomized leads from cache
  return {
    leads: shuffleArray(entry.leads),
    cached: true,
  }
}

export function saveToCache(
  category: string,
  location: string,
  leads: Lead[]
): void {
  const key = getCacheKey(category, location)
  const now = new Date()

  cache.set(key, {
    category: category.toLowerCase().trim(),
    location: location.toLowerCase().trim(),
    leads,
    scrapedAt: now,
    lastServedAt: now,
    serveCount: 0,
  })
}

export function getCacheStats(): {
  totalEntries: number
  totalLeads: number
  entries: Array<{
    category: string
    location: string
    leadCount: number
    scrapedAt: Date
    serveCount: number
  }>
} {
  const entries: Array<{
    category: string
    location: string
    leadCount: number
    scrapedAt: Date
    serveCount: number
  }> = []

  let totalLeads = 0

  cache.forEach((entry) => {
    entries.push({
      category: entry.category,
      location: entry.location,
      leadCount: entry.leads.length,
      scrapedAt: entry.scrapedAt,
      serveCount: entry.serveCount,
    })
    totalLeads += entry.leads.length
  })

  return {
    totalEntries: cache.size,
    totalLeads,
    entries,
  }
}

export function clearCache(): void {
  cache.clear()
}
