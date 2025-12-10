/**
 * Reusable hook for analyzing leads with Pro Intelligence
 * Can be used in LeadDetailModal, Pipeline, SavedLeads, and SearchHistory
 */
import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { trpc } from '@/lib/trpc'
import {
  calculateLeadScore,
  convertEnrichmentResult,
  type ScoringResult,
} from '@/lib/leadScoring'
import type { Lead } from '@/types'

export interface AnalysisState {
  isAnalyzing: boolean
  progress: number
  currentLeadId: string | null
}

export interface UseLeadAnalysisOptions {
  onAnalysisComplete?: (leadId: string, result: ScoringResult) => void
  onBatchComplete?: (results: Map<string, ScoringResult>) => void
}

export function useLeadAnalysis(options: UseLeadAnalysisOptions = {}) {
  const [state, setState] = useState<AnalysisState>({
    isAnalyzing: false,
    progress: 0,
    currentLeadId: null,
  })
  const [results, setResults] = useState<Map<string, ScoringResult>>(new Map())

  const enrichMutation = trpc.leads.enrichDiscoveredLead.useMutation()

  /**
   * Analyze a single lead
   */
  const analyzeLead = useCallback(async (lead: Lead, skipIfAnalyzed = false): Promise<ScoringResult | null> => {
    // Check if already analyzed
    if (skipIfAnalyzed && results.has(lead.id)) {
      const existingResult = results.get(lead.id)!
      toast.info('Already analyzed', {
        description: `${lead.businessName} was already analyzed (score: ${existingResult.totalScore}/100)`,
      })
      return existingResult
    }

    if (!lead.website) {
      toast.error('Cannot analyze lead', {
        description: 'This lead has no website to analyze.',
      })
      return null
    }

    setState({
      isAnalyzing: true,
      progress: 0,
      currentLeadId: lead.id,
    })

    try {
      setState(s => ({ ...s, progress: 30 }))

      const data = await enrichMutation.mutateAsync({
        id: lead.id,
        businessName: lead.businessName,
        website: lead.website,
        email: lead.email,
        googleRating: lead.googleRating,
        reviewCount: lead.reviewCount,
        instagram: lead.instagram,
        facebook: lead.facebook,
        linkedin: lead.linkedin,
        twitter: lead.twitter,
        tiktok: lead.tiktok,
        youtube: lead.youtube,
      })

      setState(s => ({ ...s, progress: 70 }))

      if (data.success && 'technologies' in data) {
        const enrichmentData = convertEnrichmentResult({
          technologies: data.technologies,
          websiteAnalysis: data.websiteAnalysis,
          domainInfo: data.domainInfo,
          socialMetrics: data.socialMetrics,
        })

        const scoringResult = calculateLeadScore(lead, enrichmentData)

        setState(s => ({ ...s, progress: 100 }))

        // Store result
        setResults(prev => new Map(prev).set(lead.id, scoringResult))

        // Callback
        options.onAnalysisComplete?.(lead.id, scoringResult)

        toast.success('Analysis complete!', {
          description: `${lead.businessName} scored ${scoringResult.totalScore}/100`,
        })

        return scoringResult
      } else {
        throw new Error('Analysis failed')
      }
    } catch (error) {
      console.error('[useLeadAnalysis] Error:', error)
      toast.error('Analysis failed', {
        description: 'Could not analyze this lead. Please try again.',
      })
      return null
    } finally {
      setState({
        isAnalyzing: false,
        progress: 0,
        currentLeadId: null,
      })
    }
  }, [enrichMutation, options, results])

  /**
   * Analyze multiple leads in batch
   * Automatically skips leads that have already been analyzed
   */
  const analyzeLeads = useCallback(async (leads: Lead[]): Promise<Map<string, ScoringResult>> => {
    const leadsWithWebsite = leads.filter(l => l.website)

    // Filter out already-analyzed leads to save credits
    const leadsToAnalyze = leadsWithWebsite.filter(l => !results.has(l.id))
    const skippedCount = leadsWithWebsite.length - leadsToAnalyze.length

    if (leadsToAnalyze.length === 0) {
      if (skippedCount > 0) {
        toast.info('All leads already analyzed', {
          description: `${skippedCount} lead${skippedCount > 1 ? 's were' : ' was'} already analyzed.`,
        })
      } else {
        toast.error('Cannot analyze leads', {
          description: 'None of the selected leads have websites to analyze.',
        })
      }
      return new Map()
    }

    // Notify about skipped leads
    if (skippedCount > 0) {
      toast.info(`Skipping ${skippedCount} already analyzed`, {
        description: `Analyzing ${leadsToAnalyze.length} new lead${leadsToAnalyze.length > 1 ? 's' : ''}.`,
      })
    }

    setState({
      isAnalyzing: true,
      progress: 0,
      currentLeadId: null,
    })

    const newResults = new Map<string, ScoringResult>()
    const batchSize = 3
    let completed = 0

    try {
      for (let i = 0; i < leadsToAnalyze.length; i += batchSize) {
        const batch = leadsToAnalyze.slice(i, i + batchSize)

        const batchResults = await Promise.allSettled(
          batch.map(async (lead) => {
            const data = await enrichMutation.mutateAsync({
              id: lead.id,
              businessName: lead.businessName,
              website: lead.website,
              email: lead.email,
              googleRating: lead.googleRating,
              reviewCount: lead.reviewCount,
              instagram: lead.instagram,
              facebook: lead.facebook,
              linkedin: lead.linkedin,
              twitter: lead.twitter,
              tiktok: lead.tiktok,
              youtube: lead.youtube,
            })

            if (data.success && 'technologies' in data) {
              const enrichmentData = convertEnrichmentResult({
                technologies: data.technologies,
                websiteAnalysis: data.websiteAnalysis,
                domainInfo: data.domainInfo,
                socialMetrics: data.socialMetrics,
              })

              return {
                leadId: lead.id,
                result: calculateLeadScore(lead, enrichmentData),
              }
            }
            return null
          })
        )

        // Process batch results
        batchResults.forEach((result) => {
          if (result.status === 'fulfilled' && result.value) {
            newResults.set(result.value.leadId, result.value.result)
          }
        })

        completed += batch.length
        setState(s => ({
          ...s,
          progress: Math.round((completed / leadsToAnalyze.length) * 100),
        }))
      }

      // Update stored results
      setResults(prev => {
        const merged = new Map(prev)
        newResults.forEach((v, k) => merged.set(k, v))
        return merged
      })

      // Callback
      options.onBatchComplete?.(newResults)

      toast.success('Batch analysis complete!', {
        description: `Analyzed ${newResults.size} lead${newResults.size > 1 ? 's' : ''}${skippedCount > 0 ? ` (${skippedCount} skipped)` : ''}`,
      })

      return newResults
    } catch (error) {
      console.error('[useLeadAnalysis] Batch error:', error)
      toast.error('Batch analysis failed', {
        description: 'Some leads could not be analyzed.',
      })
      return newResults
    } finally {
      setState({
        isAnalyzing: false,
        progress: 0,
        currentLeadId: null,
      })
    }
  }, [enrichMutation, options, results])

  /**
   * Check if a lead has been analyzed
   */
  const hasAnalysis = useCallback((leadId: string): boolean => {
    return results.has(leadId)
  }, [results])

  /**
   * Get analysis result for a lead
   */
  const getAnalysis = useCallback((leadId: string): ScoringResult | undefined => {
    return results.get(leadId)
  }, [results])

  /**
   * Clear analysis results
   */
  const clearResults = useCallback(() => {
    setResults(new Map())
  }, [])

  return {
    // State
    isAnalyzing: state.isAnalyzing,
    progress: state.progress,
    currentLeadId: state.currentLeadId,
    results,

    // Actions
    analyzeLead,
    analyzeLeads,
    hasAnalysis,
    getAnalysis,
    clearResults,
  }
}
