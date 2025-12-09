import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  Zap,
  TrendingUp,
  DollarSign,
  Lightbulb,
  Target,
  MessageSquare,
  Copy,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Briefcase,
  Activity,
  Layers,
  Check,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import type { Lead } from '@/types'
import type { ScoringResult } from '@/lib/leadScoring'
import { getLeadCategory, calculateOpportunityValue } from '@/lib/leadScoring'

interface IntelligenceReportModalProps {
  lead: Lead | null
  scoringResult: ScoringResult | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddToPipeline?: (lead: Lead) => void
}

export function IntelligenceReportModal({
  lead,
  scoringResult,
  open,
  onOpenChange,
  onAddToPipeline,
}: IntelligenceReportModalProps) {
  const [copied, setCopied] = useState(false)

  if (!lead || !scoringResult) return null

  const category = getLeadCategory(scoringResult.totalScore)
  const opportunityValue = calculateOpportunityValue(scoringResult.opportunities)

  const getCategoryColor = () => {
    switch (category) {
      case 'hot':
        return 'text-orange-500'
      case 'warm':
        return 'text-amber-500'
      case 'cold':
        return 'text-blue-500'
      default:
        return 'text-gray-500'
    }
  }

  const getCategoryBg = () => {
    switch (category) {
      case 'hot':
        return 'bg-gradient-to-r from-orange-500 to-red-500'
      case 'warm':
        return 'bg-amber-500'
      case 'cold':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(scoringResult.pitchRecommendation)
    setCopied(true)
    toast.success('Pitch copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Intelligence Report
            </DialogTitle>
            <Badge
              className={`${getCategoryBg()} text-white border-0 uppercase text-xs font-bold`}
            >
              {category} Lead
            </Badge>
          </div>
          <DialogDescription>{lead.businessName}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Score Overview */}
          <div className="grid grid-cols-2 gap-4">
            {/* Total Score */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Lead Score</span>
                <Target className="h-4 w-4 text-primary" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`text-4xl font-bold ${getCategoryColor()}`}>
                  {scoringResult.totalScore}
                </span>
                <span className="text-muted-foreground">/100</span>
              </div>
            </div>

            {/* Opportunity Value */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Opportunity</span>
                <DollarSign className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-green-500">
                  ${opportunityValue.monthly}
                </span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                ${opportunityValue.yearly.toLocaleString()}/year potential
              </p>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Score Breakdown
            </h3>
            <div className="space-y-3">
              {/* Technology Gaps */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    Technology Gaps
                  </span>
                  <span className="font-medium">
                    {scoringResult.breakdown.technologyGaps}/40
                  </span>
                </div>
                <Progress
                  value={(scoringResult.breakdown.technologyGaps / 40) * 100}
                  className="h-2"
                />
              </div>

              {/* Growth Signals */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    Growth Signals
                  </span>
                  <span className="font-medium">
                    {scoringResult.breakdown.growthSignals}/30
                  </span>
                </div>
                <Progress
                  value={(scoringResult.breakdown.growthSignals / 30) * 100}
                  className="h-2"
                />
              </div>

              {/* Budget Signals */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    Budget Signals
                  </span>
                  <span className="font-medium">
                    {scoringResult.breakdown.budgetSignals}/20
                  </span>
                </div>
                <Progress
                  value={(scoringResult.breakdown.budgetSignals / 20) * 100}
                  className="h-2"
                />
              </div>

              {/* Timing Signals */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    Timing Signals
                  </span>
                  <span className="font-medium">
                    {scoringResult.breakdown.timingSignals}/10
                  </span>
                </div>
                <Progress
                  value={(scoringResult.breakdown.timingSignals / 10) * 100}
                  className="h-2"
                />
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          {scoringResult.technologies && scoringResult.technologies.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Technology Stack
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {scoringResult.technologies.map((tech, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center justify-between p-2.5 rounded-lg border ${
                      tech.detected
                        ? 'bg-green-500/5 border-green-500/20'
                        : 'bg-red-500/5 border-red-500/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {tech.detected ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-red-500" />
                      )}
                      <span className="text-sm font-medium">{tech.name}</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-2xs ${
                        tech.detected ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {tech.category}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Opportunities */}
          {scoringResult.opportunities.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Sales Opportunities
              </h3>
              <div className="space-y-2">
                {scoringResult.opportunities.map((opp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-primary/10">
                        <XCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{opp.tool}</p>
                        <p className="text-xs text-muted-foreground">
                          {opp.description}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600/30">
                      ${opp.value}/mo
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Growth Signals */}
          {scoringResult.growthSignals.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Growth Signals Detected
              </h3>
              <div className="space-y-2">
                {scoringResult.growthSignals.map((signal, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/20"
                  >
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{signal.title}</p>
                      <p className="text-xs text-muted-foreground">{signal.details}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {signal.type.replace('_', ' ')}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Insights */}
          {scoringResult.insights.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Key Insights
              </h3>
              <ul className="space-y-1.5">
                {scoringResult.insights.map((insight, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <ArrowUpRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    {insight}
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          <Separator />

          {/* AI Pitch Recommendation */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                AI Pitch Recommendation
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyPitch}
                className="gap-1.5 text-xs"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="h-3 w-3" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <p className="text-sm leading-relaxed">
                {scoringResult.pitchRecommendation}
              </p>
            </div>
          </div>

          {/* Actions */}
          {onAddToPipeline && (
            <div className="flex gap-3 pt-2">
              <Button
                className="flex-1"
                onClick={() => {
                  onAddToPipeline(lead)
                  onOpenChange(false)
                }}
              >
                Add to Pipeline
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
