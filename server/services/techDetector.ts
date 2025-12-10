/**
 * Tech Stack Detector Client
 * Calls our self-hosted Python/Scrapy tech detection service
 */

const TECH_DETECTOR_URL = process.env.TECH_DETECTOR_URL || 'http://localhost:5001'

export interface DetectedTechnology {
  name: string
  category: string
  confidence: 'high' | 'medium'
  confidence_score: number
  match_count: number
  patterns_matched: string[]
}

export interface TechSummary {
  total_detected: number
  categories_found: number
  by_category: Record<string, Array<{ name: string; confidence: string }>>
  high_confidence_count: number
}

export interface GapAnalysis {
  detected_categories: string[]
  missing_essential: string[]
  missing_growth: string[]
  opportunities: Array<{
    service: string
    pitch: string
    monthly_value: number
    category: string
    priority: 'high' | 'medium'
  }>
  gap_score: number
}

export interface TechDetectionResult {
  success: boolean
  url: string
  final_url: string | null
  status_code: number | null
  technologies: DetectedTechnology[]
  tech_summary: TechSummary
  gap_analysis: GapAnalysis
  crawl_time: string
  error: string | null
}

/**
 * Check if the tech detector service is available
 */
export async function isTechDetectorHealthy(): Promise<boolean> {
  try {
    const response = await fetch(`${TECH_DETECTOR_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000),
    })
    return response.ok
  } catch {
    return false
  }
}

/**
 * Detect tech stack for a single URL
 */
export async function detectTechStackLocal(url: string): Promise<TechDetectionResult> {
  try {
    const response = await fetch(`${TECH_DETECTOR_URL}/detect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
      signal: AbortSignal.timeout(30000), // 30s timeout
    })

    if (!response.ok) {
      throw new Error(`Tech detector returned ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('[TechDetector] Error detecting tech stack:', error)
    return {
      success: false,
      url,
      final_url: null,
      status_code: null,
      technologies: [],
      tech_summary: {
        total_detected: 0,
        categories_found: 0,
        by_category: {},
        high_confidence_count: 0,
      },
      gap_analysis: {
        detected_categories: [],
        missing_essential: ['CRM', 'Analytics', 'Email Marketing'],
        missing_growth: ['Marketing Automation', 'Chat', 'A/B Testing'],
        opportunities: [],
        gap_score: 0,
      },
      crawl_time: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Detect tech stack for multiple URLs in batch
 */
export async function detectTechStackBatch(
  urls: string[]
): Promise<TechDetectionResult[]> {
  try {
    const response = await fetch(`${TECH_DETECTOR_URL}/detect/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urls }),
      signal: AbortSignal.timeout(60000), // 60s timeout for batch
    })

    if (!response.ok) {
      throw new Error(`Tech detector returned ${response.status}`)
    }

    const data = await response.json()
    return data.results
  } catch (error) {
    console.error('[TechDetector] Error in batch detection:', error)
    // Return failed results for all URLs
    return urls.map((url) => ({
      success: false,
      url,
      final_url: null,
      status_code: null,
      technologies: [],
      tech_summary: {
        total_detected: 0,
        categories_found: 0,
        by_category: {},
        high_confidence_count: 0,
      },
      gap_analysis: {
        detected_categories: [],
        missing_essential: ['CRM', 'Analytics', 'Email Marketing'],
        missing_growth: ['Marketing Automation', 'Chat', 'A/B Testing'],
        opportunities: [],
        gap_score: 0,
      },
      crawl_time: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    }))
  }
}

/**
 * Analyze raw HTML for technologies (no network request needed)
 */
export async function analyzeTechFromHtml(
  html: string,
  headers?: Record<string, string>
): Promise<{
  technologies: DetectedTechnology[]
  tech_summary: TechSummary
  gap_analysis: GapAnalysis
}> {
  try {
    const response = await fetch(`${TECH_DETECTOR_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ html, headers }),
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      throw new Error(`Tech detector returned ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('[TechDetector] Error analyzing HTML:', error)
    return {
      technologies: [],
      tech_summary: {
        total_detected: 0,
        categories_found: 0,
        by_category: {},
        high_confidence_count: 0,
      },
      gap_analysis: {
        detected_categories: [],
        missing_essential: ['CRM', 'Analytics', 'Email Marketing'],
        missing_growth: ['Marketing Automation', 'Chat', 'A/B Testing'],
        opportunities: [],
        gap_score: 0,
      },
    }
  }
}

/**
 * Get list of all supported technology signatures
 */
export async function getSupportedTechnologies(): Promise<{
  total: number
  categories: number
  by_category: Record<string, string[]>
}> {
  try {
    const response = await fetch(`${TECH_DETECTOR_URL}/signatures`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      throw new Error(`Tech detector returned ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('[TechDetector] Error getting signatures:', error)
    return {
      total: 0,
      categories: 0,
      by_category: {},
    }
  }
}
