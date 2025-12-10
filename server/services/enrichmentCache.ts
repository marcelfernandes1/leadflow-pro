/**
 * Enrichment Cache Service
 * Caches lead enrichment results by website URL to avoid redundant analysis
 * Shared across all users to save API credits
 */

import { db } from '../db/index.js'
import { enrichmentCache } from '../db/schema.js'
import { eq, and, gt, sql } from 'drizzle-orm'
import type { EnrichmentResult, TechnologyInfo, WebsiteAnalysis, DomainInfo, SocialMetrics } from './enrichment.js'

// Cache TTL: 60 days
const CACHE_TTL_DAYS = 60

/**
 * Normalize a website URL for use as a cache key
 * Removes protocol, www, and trailing slashes
 */
export function normalizeWebsiteKey(url: string): string {
  try {
    // Add protocol if missing
    const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`
    const parsed = new URL(urlWithProtocol)

    // Get hostname without www
    let host = parsed.hostname.replace(/^www\./, '')

    // Add path (remove trailing slash)
    let path = parsed.pathname.replace(/\/$/, '')

    // Combine and lowercase
    return `${host}${path}`.toLowerCase()
  } catch {
    // If URL parsing fails, just normalize the string
    return url
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '')
      .toLowerCase()
  }
}

/**
 * Check if we have cached enrichment data for a website
 */
export async function getEnrichmentFromCache(websiteUrl: string): Promise<{
  cached: boolean
  data?: {
    technologies: TechnologyInfo[]
    websiteAnalysis: WebsiteAnalysis | null
    domainInfo: DomainInfo | null
    socialMetrics: SocialMetrics | null
    leadScore: number | null
    scoreBreakdown: any
    opportunities: any[]
    analyzedAt: string
  }
}> {
  const websiteKey = normalizeWebsiteKey(websiteUrl)
  const now = new Date()

  try {
    const cached = await db.query.enrichmentCache.findFirst({
      where: and(
        eq(enrichmentCache.websiteKey, websiteKey),
        eq(enrichmentCache.analysisStatus, 'completed'),
        gt(enrichmentCache.expiresAt, now)
      ),
    })

    if (!cached) {
      return { cached: false }
    }

    // Increment hit count
    await db.update(enrichmentCache)
      .set({ hitCount: sql`${enrichmentCache.hitCount} + 1` })
      .where(eq(enrichmentCache.id, cached.id))

    console.log(`[EnrichmentCache] Cache HIT for ${websiteKey} (hits: ${(cached.hitCount || 0) + 1})`)

    return {
      cached: true,
      data: {
        technologies: (cached.technologies as TechnologyInfo[]) || [],
        websiteAnalysis: cached.websiteAnalysis as WebsiteAnalysis | null,
        domainInfo: cached.domainInfo as DomainInfo | null,
        socialMetrics: cached.socialMetrics as SocialMetrics | null,
        leadScore: cached.leadScore,
        scoreBreakdown: cached.scoreBreakdown,
        opportunities: (cached.opportunities as any[]) || [],
        analyzedAt: cached.analyzedAt?.toISOString() || cached.createdAt?.toISOString() || new Date().toISOString(),
      },
    }
  } catch (error) {
    console.error('[EnrichmentCache] Error checking cache:', error)
    return { cached: false }
  }
}

/**
 * Save enrichment results to cache
 */
export async function saveEnrichmentToCache(
  websiteUrl: string,
  data: {
    technologies: TechnologyInfo[]
    techSummary?: any
    gapAnalysis?: any
    websiteAnalysis: WebsiteAnalysis | null
    domainInfo: DomainInfo | null
    socialMetrics: SocialMetrics | null
    leadScore: number
    scoreBreakdown: any
    opportunities: any[]
  }
): Promise<void> {
  const websiteKey = normalizeWebsiteKey(websiteUrl)
  const now = new Date()
  const expiresAt = new Date(now.getTime() + CACHE_TTL_DAYS * 24 * 60 * 60 * 1000)

  try {
    // Check if entry exists
    const existing = await db.query.enrichmentCache.findFirst({
      where: eq(enrichmentCache.websiteKey, websiteKey),
    })

    if (existing) {
      // Update existing entry
      await db.update(enrichmentCache)
        .set({
          technologies: data.technologies,
          techSummary: data.techSummary,
          gapAnalysis: data.gapAnalysis,
          websiteAnalysis: data.websiteAnalysis,
          domainInfo: data.domainInfo,
          socialMetrics: data.socialMetrics,
          leadScore: data.leadScore,
          scoreBreakdown: data.scoreBreakdown,
          opportunities: data.opportunities,
          analysisStatus: 'completed',
          analyzedAt: now,
          expiresAt,
        })
        .where(eq(enrichmentCache.id, existing.id))

      console.log(`[EnrichmentCache] Updated cache for ${websiteKey}`)
    } else {
      // Create new entry
      await db.insert(enrichmentCache).values({
        websiteKey,
        originalUrl: websiteUrl,
        technologies: data.technologies,
        techSummary: data.techSummary,
        gapAnalysis: data.gapAnalysis,
        websiteAnalysis: data.websiteAnalysis,
        domainInfo: data.domainInfo,
        socialMetrics: data.socialMetrics,
        leadScore: data.leadScore,
        scoreBreakdown: data.scoreBreakdown,
        opportunities: data.opportunities,
        analysisStatus: 'completed',
        analyzedAt: now,
        expiresAt,
        hitCount: 0,
      })

      console.log(`[EnrichmentCache] Saved to cache for ${websiteKey}`)
    }
  } catch (error) {
    console.error('[EnrichmentCache] Error saving to cache:', error)
    // Don't throw - cache save failure shouldn't break enrichment
  }
}

/**
 * Mark a website as being processed (to avoid duplicate work)
 */
export async function markEnrichmentProcessing(websiteUrl: string): Promise<boolean> {
  const websiteKey = normalizeWebsiteKey(websiteUrl)
  const now = new Date()
  const expiresAt = new Date(now.getTime() + CACHE_TTL_DAYS * 24 * 60 * 60 * 1000)

  try {
    // Check if already processing or completed
    const existing = await db.query.enrichmentCache.findFirst({
      where: and(
        eq(enrichmentCache.websiteKey, websiteKey),
        gt(enrichmentCache.expiresAt, now)
      ),
    })

    if (existing) {
      if (existing.analysisStatus === 'processing') {
        // Already being processed by another request
        return false
      }
      if (existing.analysisStatus === 'completed') {
        // Already completed
        return false
      }
    }

    // Mark as processing
    if (existing) {
      await db.update(enrichmentCache)
        .set({ analysisStatus: 'processing' })
        .where(eq(enrichmentCache.id, existing.id))
    } else {
      await db.insert(enrichmentCache).values({
        websiteKey,
        originalUrl: websiteUrl,
        analysisStatus: 'processing',
        expiresAt,
        hitCount: 0,
      })
    }

    return true
  } catch (error) {
    console.error('[EnrichmentCache] Error marking as processing:', error)
    return true // Continue with enrichment on error
  }
}

/**
 * Mark enrichment as failed
 */
export async function markEnrichmentFailed(websiteUrl: string, errorMessage: string): Promise<void> {
  const websiteKey = normalizeWebsiteKey(websiteUrl)

  try {
    await db.update(enrichmentCache)
      .set({
        analysisStatus: 'failed',
        errorMessage,
      })
      .where(eq(enrichmentCache.websiteKey, websiteKey))
  } catch (error) {
    console.error('[EnrichmentCache] Error marking as failed:', error)
  }
}

/**
 * Get cache statistics
 */
export async function getEnrichmentCacheStats(): Promise<{
  totalEntries: number
  completedEntries: number
  totalHits: number
  avgHitsPerEntry: number
}> {
  try {
    const stats = await db.select({
      total: sql<number>`COUNT(*)`,
      completed: sql<number>`SUM(CASE WHEN analysis_status = 'completed' THEN 1 ELSE 0 END)`,
      totalHits: sql<number>`SUM(COALESCE(hit_count, 0))`,
    }).from(enrichmentCache)

    const result = stats[0]
    const total = Number(result.total) || 0
    const completed = Number(result.completed) || 0
    const totalHits = Number(result.totalHits) || 0

    return {
      totalEntries: total,
      completedEntries: completed,
      totalHits,
      avgHitsPerEntry: completed > 0 ? Math.round(totalHits / completed * 10) / 10 : 0,
    }
  } catch (error) {
    console.error('[EnrichmentCache] Error getting stats:', error)
    return {
      totalEntries: 0,
      completedEntries: 0,
      totalHits: 0,
      avgHitsPerEntry: 0,
    }
  }
}

/**
 * Clean up expired cache entries
 */
export async function cleanupExpiredCache(): Promise<number> {
  try {
    const result = await db.delete(enrichmentCache)
      .where(sql`${enrichmentCache.expiresAt} < NOW()`)

    const deletedCount = (result as any).rowCount || 0
    if (deletedCount > 0) {
      console.log(`[EnrichmentCache] Cleaned up ${deletedCount} expired entries`)
    }
    return deletedCount
  } catch (error) {
    console.error('[EnrichmentCache] Error cleaning up expired entries:', error)
    return 0
  }
}
