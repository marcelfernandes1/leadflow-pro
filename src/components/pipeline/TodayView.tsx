import { motion } from 'framer-motion'
import {
  Sun,
  Clock,
  AlertCircle,
  Calendar,
  PhoneCall,
  Mail,
  CheckCircle2,
  Plus,
  ArrowRight,
  Building2,
  DollarSign,
  Sparkles,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { Deal } from '@/types/pipeline'
import { STAGE_COLORS } from '@/types/pipeline'
import { usePipelineStore } from '@/hooks/usePipelineStore'

interface TodayViewProps {
  onViewDeal: (deal: Deal) => void
  onQuickAdd: () => void
}

export function TodayView({ onViewDeal, onQuickAdd }: TodayViewProps) {
  const {
    deals,
    settings,
    getOverdueFollowUps,
    getFollowUpsToday,
    getStaleDeals,
    clearFollowUp,
  } = usePipelineStore()

  const pipeline = settings.pipelines.find((p) => p.id === settings.activePipelineId)

  const overdueFollowUps = getOverdueFollowUps()
  const todaysFollowUps = getFollowUpsToday()
  const staleDeals = getStaleDeals()

  // Recently added deals (last 7 days)
  const recentDeals = deals
    .filter((d) => {
      const created = new Date(d.createdAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return created >= weekAgo && d.pipelineId === settings.activePipelineId
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const DealItem = ({
    deal,
    showFollowUp = false,
    showCreated = false,
  }: {
    deal: Deal
    showFollowUp?: boolean
    showCreated?: boolean
  }) => {
    const stage = pipeline?.stages.find((s) => s.id === deal.stageId)
    const colors = stage ? STAGE_COLORS[stage.color] || STAGE_COLORS.blue : STAGE_COLORS.blue
    const totalValue = deal.dealValue * deal.contractLength

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="group flex items-center gap-3 p-3 rounded-lg border border-border/30 bg-surface/30 hover:bg-surface/50 cursor-pointer transition-all"
        onClick={() => onViewDeal(deal)}
      >
        <div className={cn('w-2 h-full rounded-full min-h-[40px] bg-gradient-to-b', colors.gradient)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm truncate">{deal.companyName}</h4>
            {totalValue > 0 && (
              <span className="text-xs text-success font-medium">
                {formatCurrency(totalValue)}
              </span>
            )}
          </div>
          {deal.contactName && (
            <p className="text-xs text-muted-foreground truncate">{deal.contactName}</p>
          )}
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="default" className={cn('text-2xs', colors.text, colors.bg)}>
              {stage?.name}
            </Badge>
            {showFollowUp && deal.nextFollowUp && (
              <span className="text-2xs text-muted-foreground">
                {formatDate(deal.nextFollowUp.date)}
              </span>
            )}
            {showCreated && (
              <span className="text-2xs text-muted-foreground">
                Added {formatDate(deal.createdAt)}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {deal.phone && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation()
                window.open(`tel:${deal.phone}`)
              }}
            >
              <PhoneCall className="h-3.5 w-3.5" />
            </Button>
          )}
          {deal.email && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation()
                window.open(`mailto:${deal.email}`)
              }}
            >
              <Mail className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button variant="ghost" size="icon-sm" className="h-7 w-7">
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </motion.div>
    )
  }

  const emptyState = overdueFollowUps.length === 0 && todaysFollowUps.length === 0 && staleDeals.length === 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
            <Sun className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Today</h2>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
        <Button onClick={onQuickAdd}>
          <Plus className="h-4 w-4 mr-1" />
          Add Deal
        </Button>
      </div>

      {emptyState ? (
        // Empty State
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-3 rounded-full bg-success/10 mb-4">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-lg font-medium mb-1">You're all caught up!</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              No overdue follow-ups, no tasks for today, and no stale deals. Keep up the great
              work!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Overdue Follow-ups */}
          {overdueFollowUps.length > 0 && (
            <Card className="border-red-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  Overdue ({overdueFollowUps.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-64">
                  <div className="space-y-2">
                    {overdueFollowUps.map((deal) => (
                      <DealItem key={deal.id} deal={deal} showFollowUp />
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Today's Follow-ups */}
          {todaysFollowUps.length > 0 && (
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-primary">
                  <Calendar className="h-4 w-4" />
                  Today's Follow-ups ({todaysFollowUps.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-64">
                  <div className="space-y-2">
                    {todaysFollowUps.map((deal) => (
                      <DealItem key={deal.id} deal={deal} showFollowUp />
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Stale Deals */}
          {staleDeals.length > 0 && (
            <Card className="border-amber-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-amber-400">
                  <Clock className="h-4 w-4" />
                  Stale Deals ({staleDeals.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-64">
                  <div className="space-y-2">
                    {staleDeals.slice(0, 5).map((deal) => (
                      <DealItem key={deal.id} deal={deal} />
                    ))}
                    {staleDeals.length > 5 && (
                      <p className="text-xs text-muted-foreground text-center py-2">
                        +{staleDeals.length - 5} more stale deals
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Recently Added */}
          {recentDeals.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Recently Added
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-64">
                  <div className="space-y-2">
                    {recentDeals.map((deal) => (
                      <DealItem key={deal.id} deal={deal} showCreated />
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
