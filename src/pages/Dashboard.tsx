import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { format, formatDistanceToNow, isToday, isTomorrow, isPast } from 'date-fns'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
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
  Sparkles,
  ArrowUpRight,
  Zap,
} from 'lucide-react'
import { Link } from 'wouter'
import { useLeadStore } from '@/hooks/useLeadStore'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

const stageColors: Record<string, { bg: string; glow: string; text: string }> = {
  new: { bg: 'from-cyan to-blue-500', glow: 'shadow-cyan/30', text: 'text-cyan' },
  contacted: { bg: 'from-amber to-orange-500', glow: 'shadow-amber/30', text: 'text-amber' },
  qualified: { bg: 'from-violet to-purple-500', glow: 'shadow-violet/30', text: 'text-violet' },
  proposal: { bg: 'from-pink-500 to-rose', glow: 'shadow-rose/30', text: 'text-rose' },
  negotiation: { bg: 'from-orange-500 to-amber', glow: 'shadow-amber/30', text: 'text-amber' },
  won: { bg: 'from-emerald to-green-500', glow: 'shadow-emerald/30', text: 'text-emerald' },
  lost: { bg: 'from-gray-500 to-gray-600', glow: 'shadow-gray-500/30', text: 'text-gray-400' },
}

export default function Dashboard() {
  const { pipelineLeads, discoveredLeads } = useLeadStore()

  const stats = useMemo(() => {
    const totalLeads = discoveredLeads.length
    const inPipeline = pipelineLeads.length
    const contacted = pipelineLeads.filter(
      (l) => l.stage !== 'new' && l.lastContactedAt
    ).length
    const won = pipelineLeads.filter((l) => l.stage === 'won').length

    return [
      {
        name: 'Discovered',
        value: totalLeads,
        description: 'Total leads found',
        icon: Users,
        gradient: 'from-cyan to-blue-500',
        glow: 'shadow-cyan/20',
      },
      {
        name: 'In Pipeline',
        value: inPipeline,
        description: 'Active prospects',
        icon: Target,
        gradient: 'from-violet to-purple-500',
        glow: 'shadow-violet/20',
      },
      {
        name: 'Contacted',
        value: contacted,
        description: 'Leads reached',
        icon: TrendingUp,
        gradient: 'from-amber to-orange-500',
        glow: 'shadow-amber/20',
      },
      {
        name: 'Won',
        value: won,
        description: 'Closed deals',
        icon: CheckCircle2,
        gradient: 'from-emerald to-green-500',
        glow: 'shadow-emerald/20',
      },
    ]
  }, [pipelineLeads, discoveredLeads])

  const followUpsDue = useMemo(() => {
    const now = new Date()
    return pipelineLeads
      .filter((l) => l.nextFollowUpAt)
      .map((l) => ({
        ...l,
        followUpDate: new Date(l.nextFollowUpAt!),
      }))
      .filter((l) => {
        const diff = l.followUpDate.getTime() - now.getTime()
        const daysDiff = diff / (1000 * 60 * 60 * 24)
        return daysDiff <= 7
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
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 8)
  }, [pipelineLeads])

  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = {
      new: 0,
      contacted: 0,
      qualified: 0,
      proposal: 0,
      negotiation: 0,
      won: 0,
      lost: 0,
    }
    pipelineLeads.forEach((l) => {
      counts[l.stage] = (counts[l.stage] || 0) + 1
    })
    return counts
  }, [pipelineLeads])

  const getFollowUpBadge = (date: Date) => {
    if (isPast(date) && !isToday(date)) {
      return <Badge variant="destructive" className="text-xs">Overdue</Badge>
    }
    if (isToday(date)) {
      return <Badge variant="warning" className="text-xs">Today</Badge>
    }
    if (isTomorrow(date)) {
      return <Badge variant="secondary" className="text-xs">Tomorrow</Badge>
    }
    return <Badge variant="outline" className="text-xs">{format(date, 'MMM d')}</Badge>
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-display font-bold tracking-tight">
            Dashboard
          </h1>
          <Badge variant="glow" className="animate-pulse-glow">
            <Sparkles className="w-3 h-3 mr-1" />
            Live
          </Badge>
        </div>
        <p className="text-muted-foreground text-lg">
          Welcome back. Here's your lead generation overview.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover className="relative overflow-hidden group">
              {/* Background glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.name}
                </CardTitle>
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg ${stat.glow}`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-display font-bold tabular-nums">
                    {stat.value}
                  </span>
                  {stat.value > 0 && (
                    <span className="text-emerald text-sm font-medium flex items-center">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {hasData ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Follow-up Reminders */}
          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber/10">
                      <Calendar className="h-5 w-5 text-amber" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Follow-ups</CardTitle>
                      <CardDescription>Upcoming reminders</CardDescription>
                    </div>
                  </div>
                  {followUpsDue.length > 0 && (
                    <Badge variant="warning">{followUpsDue.length}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {followUpsDue.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="p-3 rounded-full bg-muted mb-3">
                      <Calendar className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">No follow-ups scheduled</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[280px] pr-4">
                    <div className="space-y-3">
                      {followUpsDue.map((lead, index) => (
                        <motion.div
                          key={lead.pipelineId}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-transparent hover:border-border/50 transition-all duration-200"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {lead.businessName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {lead.city}, {lead.state}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-3">
                            {getFollowUpBadge(lead.followUpDate)}
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {lead.phone && (
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  onClick={() => window.open(`tel:${lead.phone}`)}
                                >
                                  <Phone className="h-3.5 w-3.5" />
                                </Button>
                              )}
                              {lead.email && (
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  onClick={() => window.open(`mailto:${lead.email}`)}
                                >
                                  <Mail className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-violet/10">
                    <Clock className="h-5 w-5 text-violet" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Activity</CardTitle>
                    <CardDescription>Recent actions</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {recentActivity.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="p-3 rounded-full bg-muted mb-3">
                      <Clock className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">No activity yet</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[280px] pr-4">
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-start gap-3"
                        >
                          <div className="p-2 rounded-lg bg-white/5 text-muted-foreground">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {activity.leadName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {activity.details}
                            </p>
                            <p className="text-2xs text-muted-foreground/60 mt-0.5">
                              {formatDistanceToNow(new Date(activity.createdAt), {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Pipeline Overview */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan/10">
                      <Target className="h-5 w-5 text-cyan" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Pipeline</CardTitle>
                      <CardDescription>Lead distribution by stage</CardDescription>
                    </div>
                  </div>
                  <Link href="/pipeline">
                    <Button variant="outline" size="sm" className="gap-2">
                      View Pipeline
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  {[
                    { id: 'new', label: 'New' },
                    { id: 'contacted', label: 'Contacted' },
                    { id: 'qualified', label: 'Qualified' },
                    { id: 'proposal', label: 'Proposal' },
                    { id: 'negotiation', label: 'Negotiating' },
                    { id: 'won', label: 'Won' },
                    { id: 'lost', label: 'Lost' },
                  ].map((stage, index) => (
                    <motion.div
                      key={stage.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative p-4 rounded-xl bg-white/[0.02] border border-border/30 hover:border-border/50 transition-all duration-200"
                    >
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${stageColors[stage.id].bg} opacity-0 group-hover:opacity-5 transition-opacity`} />
                      <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${stageColors[stage.id].bg} shadow-lg ${stageColors[stage.id].glow} mb-3`} />
                      <p className="text-3xl font-display font-bold tabular-nums">
                        {stageCounts[stage.id] || 0}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {stage.label}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      ) : (
        <>
          {/* Get Started */}
          <motion.div variants={itemVariants}>
            <Card variant="gradient" className="overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet/10 via-transparent to-cyan/10" />
              <CardHeader className="relative">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-violet to-cyan shadow-lg shadow-violet/20">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Get Started</CardTitle>
                    <CardDescription>
                      Discover leads and build your pipeline
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative flex flex-wrap gap-3">
                <Link href="/discover">
                  <Button className="gap-2">
                    <Search className="h-4 w-4" />
                    Discover Leads
                  </Button>
                </Link>
                <Link href="/pipeline">
                  <Button variant="outline" className="gap-2">
                    <Target className="h-4 w-4" />
                    View Pipeline
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Empty State */}
          <motion.div variants={itemVariants}>
            <Card className="border-dashed border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="relative mb-6">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-violet/10 to-cyan/10 border border-border/30">
                    <Search className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-violet/20 to-cyan/20 blur-xl opacity-50" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-2">
                  No leads yet
                </h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  Start by searching for businesses in your target market.
                  Our AI will help you find high-intent leads ready to buy.
                </p>
                <Link href="/discover">
                  <Button size="lg" className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    Start Discovering
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </motion.div>
  )
}
