import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Trophy,
  Target,
  Clock,
  Percent,
  BarChart3,
  ArrowRight,
  Users,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { Deal } from '@/types/pipeline'
import { STAGE_COLORS } from '@/types/pipeline'
import { usePipelineStore } from '@/hooks/usePipelineStore'

interface PipelineAnalyticsProps {
  revenueGoal?: number
}

export function PipelineAnalytics({ revenueGoal = 50000 }: PipelineAnalyticsProps) {
  const {
    deals,
    settings,
    getPipelineValue,
    getWeightedValue,
    getWinRate,
    getAvgDaysInStage,
    getDealsClosedInPeriod,
  } = usePipelineStore()

  const pipeline = settings.pipelines.find((p) => p.id === settings.activePipelineId)
  const stages = useMemo(
    () => pipeline?.stages.sort((a, b) => a.order - b.order) || [],
    [pipeline]
  )

  const pipelineDeals = deals.filter((d) => d.pipelineId === settings.activePipelineId)

  // Core metrics
  const totalValue = getPipelineValue(settings.activePipelineId)
  const weightedValue = getWeightedValue(settings.activePipelineId)
  const winRateAll = getWinRate(settings.activePipelineId, 'all')
  const winRateMonth = getWinRate(settings.activePipelineId, 'month')

  // Closed deals this month
  const { won: wonThisMonth, lost: lostThisMonth } = getDealsClosedInPeriod(
    settings.activePipelineId,
    'month'
  )
  const revenueThisMonth = wonThisMonth.reduce(
    (sum, d) => sum + d.dealValue * d.contractLength,
    0
  )

  // Average deal size
  const avgDealSize = pipelineDeals.length > 0
    ? pipelineDeals.reduce((sum, d) => sum + d.dealValue * d.contractLength, 0) / pipelineDeals.length
    : 0

  // Stage metrics
  const stageMetrics = useMemo(() => {
    return stages
      .filter((s) => !s.isLostStage) // Exclude lost stage
      .map((stage) => {
        const stageDeals = pipelineDeals.filter((d) => d.stageId === stage.id)
        const value = stageDeals.reduce((sum, d) => sum + d.dealValue * d.contractLength, 0)
        const weightedVal = value * (stage.probability / 100)
        const avgDays = getAvgDaysInStage(settings.activePipelineId, stage.id)

        // Calculate conversion rate to next stage
        const nextStage = stages.find((s) => s.order === stage.order + 1)
        let conversionRate = 0
        if (nextStage) {
          const enteredThis = pipelineDeals.filter((d) =>
            d.stageHistory.some((h) => h.toStageId === stage.id)
          ).length
          const movedToNext = pipelineDeals.filter((d) =>
            d.stageHistory.some(
              (h) => h.fromStageId === stage.id && h.toStageId === nextStage.id
            )
          ).length
          conversionRate = enteredThis > 0 ? (movedToNext / enteredThis) * 100 : 0
        }

        return {
          stage,
          count: stageDeals.length,
          value,
          weightedVal,
          avgDays,
          conversionRate,
        }
      })
  }, [stages, pipelineDeals, settings.activePipelineId])

  // Funnel data
  const funnelData = useMemo(() => {
    const activeStages = stages.filter((s) => !s.isWonStage && !s.isLostStage)
    if (activeStages.length === 0) return []

    const firstStageCount = pipelineDeals.filter(
      (d) =>
        d.stageHistory.some((h) => h.toStageId === activeStages[0]?.id) ||
        d.stageId === activeStages[0]?.id
    ).length

    return activeStages.map((stage, i) => {
      const count = pipelineDeals.filter((d) => d.stageId === stage.id).length
      const enteredCount = pipelineDeals.filter((d) =>
        d.stageHistory.some((h) => h.toStageId === stage.id)
      ).length
      const percentage = firstStageCount > 0 ? (enteredCount / firstStageCount) * 100 : 0

      return {
        stage,
        count,
        enteredCount,
        percentage,
      }
    })
  }, [stages, pipelineDeals])

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)

  const goalProgress = Math.min((revenueThisMonth / revenueGoal) * 100, 100)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-violet-500/10 border border-primary/20">
          <BarChart3 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Pipeline Analytics</h2>
          <p className="text-sm text-muted-foreground">
            {pipeline?.name || 'Sales Pipeline'} performance
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="surface">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
              <DollarSign className="h-3.5 w-3.5" />
              Pipeline Value
            </div>
            <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(weightedValue)} weighted
            </p>
          </CardContent>
        </Card>

        <Card variant="surface">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
              <Percent className="h-3.5 w-3.5" />
              Win Rate
            </div>
            <p className="text-2xl font-bold">{winRateAll.toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              {winRateMonth.toFixed(0)}% this month
            </p>
          </CardContent>
        </Card>

        <Card variant="surface">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
              <Trophy className="h-3.5 w-3.5" />
              Won This Month
            </div>
            <p className="text-2xl font-bold text-success">
              {wonThisMonth.length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(revenueThisMonth)} revenue
            </p>
          </CardContent>
        </Card>

        <Card variant="surface">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
              <Target className="h-3.5 w-3.5" />
              Avg Deal Size
            </div>
            <p className="text-2xl font-bold">{formatCurrency(avgDealSize)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {pipelineDeals.length} total deals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Goal Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span>Monthly Revenue Goal</span>
            <span className="text-muted-foreground">
              {formatCurrency(revenueThisMonth)} / {formatCurrency(revenueGoal)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={goalProgress} className="h-3" />
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {goalProgress.toFixed(0)}% of goal
              </span>
              <span
                className={cn(
                  'font-medium',
                  goalProgress >= 100 ? 'text-success' : 'text-muted-foreground'
                )}
              >
                {goalProgress >= 100
                  ? 'Goal achieved!'
                  : `${formatCurrency(revenueGoal - revenueThisMonth)} to go`}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stage Breakdown */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Stage Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stageMetrics.map(
              ({ stage, count, value, weightedVal, avgDays, conversionRate }) => {
                const colors = STAGE_COLORS[stage.color] || STAGE_COLORS.blue

                return (
                  <div key={stage.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            'w-3 h-3 rounded-full bg-gradient-to-br',
                            colors.gradient
                          )}
                        />
                        <span className="text-sm font-medium">{stage.name}</span>
                        <Badge variant="default" className="text-2xs">
                          {count}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{formatCurrency(value)}</span>
                        <span className="text-2xs">{avgDays.toFixed(0)}d avg</span>
                        {conversionRate > 0 && (
                          <span className="text-2xs flex items-center gap-0.5">
                            <ArrowRight className="h-3 w-3" />
                            {conversionRate.toFixed(0)}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <div
                        className={cn('h-1.5 rounded-full bg-gradient-to-r', colors.gradient)}
                        style={{
                          width: `${Math.max((value / totalValue) * 100, 2)}%`,
                        }}
                      />
                      <div
                        className="h-1.5 rounded-full bg-surface flex-1"
                      />
                    </div>
                  </div>
                )
              }
            )}
          </div>
        </CardContent>
      </Card>

      {/* Funnel Visualization */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {funnelData.map(({ stage, count, enteredCount, percentage }, i) => {
              const colors = STAGE_COLORS[stage.color] || STAGE_COLORS.blue
              const maxWidth = Math.max(percentage, 10)

              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-28 text-sm text-right truncate">{stage.name}</div>
                  <div className="flex-1 relative">
                    <div
                      className={cn(
                        'h-8 rounded-lg bg-gradient-to-r flex items-center justify-end pr-3',
                        colors.gradient
                      )}
                      style={{ width: `${maxWidth}%` }}
                    >
                      <span className="text-xs font-medium text-white">
                        {count}
                      </span>
                    </div>
                  </div>
                  <div className="w-12 text-xs text-muted-foreground text-right">
                    {percentage.toFixed(0)}%
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Won vs Lost */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-success/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-success">
              <Trophy className="h-4 w-4" />
              Won Deals (This Month)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {wonThisMonth.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No deals won this month yet
              </p>
            ) : (
              <div className="space-y-2">
                {wonThisMonth.slice(0, 5).map((deal) => (
                  <div
                    key={deal.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-success/5"
                  >
                    <div>
                      <p className="text-sm font-medium">{deal.companyName}</p>
                      <p className="text-xs text-muted-foreground">
                        {deal.closedAt
                          ? new Date(deal.closedAt).toLocaleDateString()
                          : ''}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-success">
                      {formatCurrency(deal.dealValue * deal.contractLength)}
                    </span>
                  </div>
                ))}
                {wonThisMonth.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    +{wonThisMonth.length - 5} more
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-destructive/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-destructive">
              <TrendingDown className="h-4 w-4" />
              Lost Deals (This Month)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lostThisMonth.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No deals lost this month
              </p>
            ) : (
              <div className="space-y-2">
                {lostThisMonth.slice(0, 5).map((deal) => (
                  <div
                    key={deal.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-destructive/5"
                  >
                    <div>
                      <p className="text-sm font-medium">{deal.companyName}</p>
                      <p className="text-xs text-muted-foreground">
                        {deal.closeReason || 'No reason given'}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {formatCurrency(deal.dealValue * deal.contractLength)}
                    </span>
                  </div>
                ))}
                {lostThisMonth.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    +{lostThisMonth.length - 5} more
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
