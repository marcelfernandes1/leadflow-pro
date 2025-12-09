import type { Lead } from './apify.js'
import { db, searchCache } from '../db/index.js'
import { eq, and, gte, sql } from 'drizzle-orm'

const CACHE_TTL_DAYS = 60 // Cache expires after 60 days

// In-memory fallback for when DB is unavailable
const memoryCache = new Map<string, {
  leads: Lead[]
  scrapedAt: Date
  lastServedAt: Date
  serveCount: number
}>()

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

/**
 * Check cache for existing results
 * First tries database, falls back to memory cache
 */
export async function checkCache(
  category: string,
  location: string
): Promise<{ leads: Lead[]; cached: boolean } | null> {
  const normalizedCategory = category.toLowerCase().trim()
  const normalizedLocation = location.toLowerCase().trim()

  try {
    // Calculate the cutoff date for valid cache entries
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - CACHE_TTL_DAYS)

    // Query database for cached results
    const results = await db
      .select()
      .from(searchCache)
      .where(
        and(
          eq(searchCache.category, normalizedCategory),
          eq(searchCache.location, normalizedLocation),
          gte(searchCache.scrapedAt, cutoffDate)
        )
      )
      .limit(1)

    if (results.length > 0) {
      const entry = results[0]
      const leads = entry.leadIds as Lead[]

      // Update cache metadata (lastServedAt, serveCount)
      await db
        .update(searchCache)
        .set({
          lastServedAt: new Date(),
          serveCount: sql`${searchCache.serveCount} + 1`,
        })
        .where(eq(searchCache.id, entry.id))

      console.log(`[Cache] Hit for "${category}" in "${location}" - ${leads.length} leads from DB`)

      return {
        leads: shuffleArray(leads),
        cached: true,
      }
    }
  } catch (error) {
    console.error('[Cache] Database error, falling back to memory cache:', error)
  }

  // Fallback to memory cache
  const key = getCacheKey(category, location)
  const memEntry = memoryCache.get(key)

  if (memEntry) {
    const now = new Date()
    const ageInDays = (now.getTime() - memEntry.scrapedAt.getTime()) / (1000 * 60 * 60 * 24)

    if (ageInDays <= CACHE_TTL_DAYS) {
      memEntry.lastServedAt = now
      memEntry.serveCount += 1

      console.log(`[Cache] Hit for "${category}" in "${location}" - ${memEntry.leads.length} leads from memory`)

      return {
        leads: shuffleArray(memEntry.leads),
        cached: true,
      }
    } else {
      memoryCache.delete(key)
    }
  }

  console.log(`[Cache] Miss for "${category}" in "${location}"`)
  return null
}

/**
 * Save results to cache
 * Saves to both database and memory cache for redundancy
 */
export async function saveToCache(
  category: string,
  location: string,
  leads: Lead[]
): Promise<void> {
  const normalizedCategory = category.toLowerCase().trim()
  const normalizedLocation = location.toLowerCase().trim()
  const now = new Date()

  // Save to memory cache (immediate, always works)
  const key = getCacheKey(category, location)
  memoryCache.set(key, {
    leads,
    scrapedAt: now,
    lastServedAt: now,
    serveCount: 0,
  })

  try {
    // Check if entry already exists
    const existing = await db
      .select({ id: searchCache.id })
      .from(searchCache)
      .where(
        and(
          eq(searchCache.category, normalizedCategory),
          eq(searchCache.location, normalizedLocation)
        )
      )
      .limit(1)

    if (existing.length > 0) {
      // Update existing entry
      await db
        .update(searchCache)
        .set({
          scrapedAt: now,
          lastServedAt: now,
          serveCount: 0,
          leadCount: leads.length,
          leadIds: leads as unknown as string[], // Store full lead data as JSON
        })
        .where(eq(searchCache.id, existing[0].id))

      console.log(`[Cache] Updated DB entry for "${category}" in "${location}" - ${leads.length} leads`)
    } else {
      // Insert new entry
      await db.insert(searchCache).values({
        category: normalizedCategory,
        location: normalizedLocation,
        scrapedAt: now,
        lastServedAt: now,
        serveCount: 0,
        leadCount: leads.length,
        leadIds: leads as unknown as string[], // Store full lead data as JSON
      })

      console.log(`[Cache] Created DB entry for "${category}" in "${location}" - ${leads.length} leads`)
    }
  } catch (error) {
    console.error('[Cache] Failed to save to database:', error)
    // Memory cache already saved, so operation still partially succeeds
  }
}

/**
 * Get cache statistics
 * Combines database and memory cache stats
 */
export async function getCacheStats(): Promise<{
  totalEntries: number
  totalLeads: number
  entries: Array<{
    category: string
    location: string
    leadCount: number
    scrapedAt: Date
    serveCount: number
    source: 'db' | 'memory'
  }>
}> {
  const entries: Array<{
    category: string
    location: string
    leadCount: number
    scrapedAt: Date
    serveCount: number
    source: 'db' | 'memory'
  }> = []

  let totalLeads = 0

  try {
    // Get database entries
    const dbResults = await db.select().from(searchCache)

    dbResults.forEach((entry) => {
      entries.push({
        category: entry.category,
        location: entry.location,
        leadCount: entry.leadCount,
        scrapedAt: entry.scrapedAt,
        serveCount: entry.serveCount ?? 0,
        source: 'db',
      })
      totalLeads += entry.leadCount
    })
  } catch (error) {
    console.error('[Cache] Failed to get database stats:', error)
  }

  // Add memory cache entries (excluding duplicates)
  const dbKeys = new Set(entries.map((e) => `${e.category}::${e.location}`))

  memoryCache.forEach((entry, key) => {
    if (!dbKeys.has(key)) {
      const [category, location] = key.split('::')
      entries.push({
        category,
        location,
        leadCount: entry.leads.length,
        scrapedAt: entry.scrapedAt,
        serveCount: entry.serveCount,
        source: 'memory',
      })
      totalLeads += entry.leads.length
    }
  })

  return {
    totalEntries: entries.length,
    totalLeads,
    entries,
  }
}

/**
 * Clear all cache entries
 */
export async function clearCache(): Promise<void> {
  // Clear memory cache
  memoryCache.clear()

  try {
    // Clear database cache
    await db.delete(searchCache)
    console.log('[Cache] Cleared all cache entries')
  } catch (error) {
    console.error('[Cache] Failed to clear database cache:', error)
  }
}

/**
 * Clean up expired cache entries
 */
export async function cleanExpiredCache(): Promise<number> {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - CACHE_TTL_DAYS)
  let deletedCount = 0

  try {
    const result = await db
      .delete(searchCache)
      .where(sql`${searchCache.scrapedAt} < ${cutoffDate}`)

    deletedCount = result[0]?.affectedRows ?? 0
    console.log(`[Cache] Cleaned ${deletedCount} expired entries from database`)
  } catch (error) {
    console.error('[Cache] Failed to clean expired entries:', error)
  }

  // Clean memory cache
  const now = new Date()
  memoryCache.forEach((entry, key) => {
    const ageInDays = (now.getTime() - entry.scrapedAt.getTime()) / (1000 * 60 * 60 * 24)
    if (ageInDays > CACHE_TTL_DAYS) {
      memoryCache.delete(key)
      deletedCount++
    }
  })

  return deletedCount
}
