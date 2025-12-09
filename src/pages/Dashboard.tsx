import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { format, formatDistanceToNow, isToday, isTomorrow, isPast } from 'date-fns'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import {
  Search,
  Users,
  Target,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle2,
  ArrowRight,
  Phone,
  Mail,
  Send,
  Zap,
  Crown,
  Sparkles,
} from 'lucide-react'
import { Link } from 'wouter'
import { useLeadStore } from '@/hooks/useLeadStore'
import { useSubscription } from '@/hooks/useSubscription'

const stageConfig: Record<string, { color: string; bg: string }> = {
  new: { color: 'text-cold', bg: 'bg-cold/10' },
  contacted: { color: 'text-warm', bg: 'bg-warm/10' },
  qualified: { color: 'text-primary', bg: 'bg-primary/10' },
  proposal: { color: 'text-purple-400', bg: 'bg-purple-400/10' },
  negotiation: { color: 'text-orange-400', bg: 'bg-orange-400/10' },
  won: { color: 'text-success', bg: 'bg-success/10' },
  lost: { color: 'text-muted-foreground', bg: 'bg-muted/10' },
}

const tierConfig: Record<string, { label: string; color: string; bg: string; icon: typeof Crown }> = {
  free: { label: 'Free', color: 'text-muted-foreground', bg: 'bg-muted/20', icon: Zap },
  pro: { label: 'Pro', color: 'text-primary', bg: 'bg-primary/10', icon: Sparkles },
  agency: { label: 'Agency', color: 'text-purple-400', bg: 'bg-purple-400/10', icon: Crown },
  enterprise: { label: 'Enterprise', color: 'text-amber-400', bg: 'bg-amber-400/10', icon: Crown },
}

export default function Dashboard() {
  const { pipelineLeads, discoveredLeads } = useLeadStore()
  const { tier, limits, usage, remainingSearches, remainingLeads } = useSubscription()

  const stats = useMemo(() => {
    const totalLeads = discoveredLeads.length
    const inPipeline = pipelineLeads.length
    const contacted = pipelineLeads.filter(
      (l) => l.stage !== 'new' && l.lastContactedAt
    ).length
    const won = pipelineLeads.filter((l) => l.stage === 'won').length

    return [
      { label: 'DISCOVERED', value: totalLeads, icon: Users, color: 'text-cold' },
      { label: 'IN PIPELINE', value: inPipeline, icon: Target, color: 'text-primary' },
      { label: 'CONTACTED', value: contacted, icon: TrendingUp, color: 'text-warm' },
      { label: 'WON', value: won, icon: CheckCircle2, color: 'text-success' },
    ]
  }, [pipelineLeads, discoveredLeads])

  const followUpsDue = useMemo(() => {
    const now = new Date()
    return pipelineLeads
      .filter((l) => l.nextFollowUpAt)
      .map((l) => ({ ...l, followUpDate: new Date(l.nextFollowUpAt!) }))
      .filter((l) => {
        const diff = l.followUpDate.getTime() - now.getTime()
        return diff / (1000 * 60 * 60 * 24) <= 7
      })
      .sort((a, b) => a.followUpDate.getTime() - b.followUpDate.getTime())
  }, [pipelineLeads])

  const recentActivity = useMemo(() => {
    const activities: Array<{
      id: string
      leadName: string
      type: string
      details: string
      createdAt: string
    }> = []

    pipelineLeads.forEach((lead) => {
      lead.activities?.forEach((activity) => {
        activities.push({
          id: activity.id,
          leadName: lead.businessName,
          type: activity.type,
          details: activity.details,
          createdAt: activity.createdAt,
        })
      })
    })

    return activities
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6)
  }, [pipelineLeads])

  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    pipelineLeads.forEach((l) => {
      counts[l.stage] = (counts[l.stage] || 0) + 1
    })
    return counts
  }, [pipelineLeads])

  const getFollowUpBadge = (date: Date) => {
    if (isPast(date) && !isToday(date)) {
      return <Badge variant="destructive">Overdue</Badge>
    }
    if (isToday(date)) {
      return <Badge variant="warm">Today</Badge>
    }
    if (isTomorrow(date)) {
      return <Badge variant="secondary">Tomorrow</Badge>
    }
    return <Badge variant="outline">{format(date, 'MMM d')}</Badge>
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contacted':
        return <Send className="h-3.5 w-3.5" />
      case 'stage_changed':
        return <ArrowRight className="h-3.5 w-3.5" />
      default:
        return <Clock className="h-3.5 w-3.5" />
    }
  }

  const hasData = pipelineLeads.length > 0 || discoveredLeads.length > 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Your lead generation command center.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="label-caps text-muted-foreground">{stat.label}</p>
                    <p className="text-4xl font-semibold tabular-nums mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-surface ${stat.color}`}>
                    <stat.icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Subscription Usage */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col lg:flex-row">
              {/* Plan Info */}
              <div className={`flex-1 p-6 ${tierConfig[tier].bg}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg bg-background/50 ${tierConfig[tier].color}`}>
                    {(() => {
                      const TierIcon = tierConfig[tier].icon
                      return <TierIcon className="h-5 w-5" />
                    })()}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Current Plan</p>
                    <p className={`text-xl font-semibold ${tierConfig[tier].color}`}>
                      {tierConfig[tier].label}
                    </p>
                  </div>
                </div>
                {tier === 'free' && (
                  <Link href="/settings">
                    <Button size="sm" className="mt-2">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Upgrade to Pro
                    </Button>
                  </Link>
                )}
              </div>

              {/* Usage Stats */}
              <div className="flex-[2] p-6 grid sm:grid-cols-2 gap-6">
                {/* Searches Today */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Searches Today</p>
                    <p className="text-sm font-medium tabular-nums">
                      {usage.searchesToday} / {limits.searchesPerDay === Infinity ? '∞' : limits.searchesPerDay}
                    </p>
                  </div>
                  <Progress
                    value={limits.searchesPerDay === Infinity ? 0 : (usage.searchesToday / limits.searchesPerDay) * 100}
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {remainingSearches === Infinity ? 'Unlimited' : `${remainingSearches} remaining`}
                  </p>
                </div>

                {/* Leads This Month */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Leads This Month</p>
                    <p className="text-sm font-medium tabular-nums">
                      {usage.leadsThisMonth} / {limits.leadsPerMonth === Infinity ? '∞' : limits.leadsPerMonth.toLocaleString()}
                    </p>
                  </div>
                  <Progress
                    value={limits.leadsPerMonth === Infinity ? 0 : (usage.leadsThisMonth / limits.leadsPerMonth) * 100}
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {remainingLeads === Infinity ? 'Unlimited' : `${remainingLeads.toLocaleString()} remaining`}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {hasData ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Follow-ups */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warm/10">
                  <Calendar className="h-4 w-4 text-warm" />
                </div>
                <CardTitle className="text-base">Follow-ups Due</CardTitle>
              </div>
              {followUpsDue.length > 0 && (
                <Badge variant="warm">{followUpsDue.length}</Badge>
              )}
            </CardHeader>
            <CardContent>
              {followUpsDue.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <Calendar className="h-8 w-8 mb-2 opacity-40" />
                  <p className="text-sm">No follow-ups scheduled.</p>
                </div>
              ) : (
                <ScrollArea className="h-[260px]">
                  <div className="space-y-2">
                    {followUpsDue.map((lead) => (
                      <div
                        key={lead.pipelineId}
                        className="group flex items-center justify-between p-3 rounded-lg hover:bg-surface transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{lead.businessName}</p>
                          <p className="text-xs text-muted-foreground">{lead.city}, {lead.state}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {getFollowUpBadge(lead.followUpDate)}
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {lead.phone && (
                              <Button size="icon-sm" variant="ghost" onClick={() => window.open(`tel:${lead.phone}`)}>
                                <Phone className="h-3.5 w-3.5" />
                              </Button>
                            )}
                            {lead.email && (
                              <Button size="icon-sm" variant="ghost" onClick={() => window.open(`mailto:${lead.email}`)}>
                                <Mail className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Activity */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <Clock className="h-8 w-8 mb-2 opacity-40" />
                  <p className="text-sm">No activity yet.</p>
                </div>
              ) : (
                <ScrollArea className="h-[260px]">
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className="p-2 rounded-md bg-surface text-muted-foreground">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{activity.leadName}</p>
                          <p className="text-xs text-muted-foreground truncate">{activity.details}</p>
                          <p className="text-2xs text-muted-foreground/60 mt-0.5">
                            {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Pipeline Overview */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cold/10">
                  <Target className="h-4 w-4 text-cold" />
                </div>
                <CardTitle className="text-base">Pipeline Overview</CardTitle>
              </div>
              <Link href="/pipeline">
                <Button variant="outline" size="sm">
                  View Pipeline
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {[
                  { id: 'new', label: 'New' },
                  { id: 'contacted', label: 'Contacted' },
                  { id: 'qualified', label: 'Qualified' },
                  { id: 'proposal', label: 'Proposal' },
                  { id: 'negotiation', label: 'Negotiation' },
                  { id: 'won', label: 'Won' },
                  { id: 'lost', label: 'Lost' },
                ].map((stage) => (
                  <div
                    key={stage.id}
                    className="p-4 rounded-lg bg-surface border border-border/40"
                  >
                    <div className={`w-2 h-2 rounded-full ${stageConfig[stage.id].bg.replace('/10', '')} mb-3`} />
                    <p className="text-2xl font-semibold tabular-nums">
                      {stageCounts[stage.id] || 0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{stage.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Empty State */
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 rounded-xl bg-surface mb-4">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Start discovering leads</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-sm">
              Search for businesses in your target market. Our AI finds high-intent leads ready to buy.
            </p>
            <Link href="/discover">
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Discover Leads
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
