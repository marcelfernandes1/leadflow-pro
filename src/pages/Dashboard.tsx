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
  AlertCircle,
  ArrowRight,
  Phone,
  Mail,
  Send,
} from 'lucide-react'
import { Link } from 'wouter'
import { useLeadStore } from '@/hooks/useLeadStore'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
}

export default function Dashboard() {
  const { pipelineLeads, discoveredLeads } = useLeadStore()

  // Calculate real stats
  const stats = useMemo(() => {
    const totalLeads = discoveredLeads.length
    const inPipeline = pipelineLeads.length
    const contacted = pipelineLeads.filter(
      (l) => l.stage !== 'new' && l.lastContactedAt
    ).length
    const won = pipelineLeads.filter((l) => l.stage === 'won').length

    return [
      {
        name: 'Total Discovered',
        value: totalLeads.toString(),
        description: 'Leads from searches',
        icon: Users,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
      },
      {
        name: 'In Pipeline',
        value: inPipeline.toString(),
        description: 'Active prospects',
        icon: Target,
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
      },
      {
        name: 'Contacted',
        value: contacted.toString(),
        description: 'Leads reached out to',
        icon: TrendingUp,
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/10',
      },
      {
        name: 'Won',
        value: won.toString(),
        description: 'Closed deals',
        icon: CheckCircle2,
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/10',
      },
    ]
  }, [pipelineLeads, discoveredLeads])

  // Get follow-ups due
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
        // Show follow-ups due within next 7 days or overdue
        return daysDiff <= 7
      })
      .sort((a, b) => a.followUpDate.getTime() - b.followUpDate.getTime())
  }, [pipelineLeads])

  // Get recent activity
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
      .slice(0, 10)
  }, [pipelineLeads])

  // Pipeline stage counts
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
      return (
        <Badge variant="destructive" className="text-xs">
          Overdue
        </Badge>
      )
    }
    if (isToday(date)) {
      return (
        <Badge variant="default" className="text-xs bg-amber-500">
          Today
        </Badge>
      )
    }
    if (isTomorrow(date)) {
      return (
        <Badge variant="secondary" className="text-xs">
          Tomorrow
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="text-xs">
        {format(date, 'MMM d')}
      </Badge>
    )
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contacted':
        return <Send className="h-3 w-3" />
      case 'stage_changed':
        return <ArrowRight className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
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
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to LeadFlow Pro. Start discovering high-intent leads.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </CardTitle>
              <div className={`p-2 rounded-md ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      {hasData ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Follow-up Reminders */}
          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Follow-up Reminders
                    </CardTitle>
                    <CardDescription>
                      Upcoming and overdue follow-ups
                    </CardDescription>
                  </div>
                  {followUpsDue.length > 0 && (
                    <Badge variant="secondary">{followUpsDue.length}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {followUpsDue.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No follow-ups scheduled</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[250px]">
                    <div className="space-y-3">
                      {followUpsDue.map((lead) => (
                        <motion.div
                          key={lead.pipelineId}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {lead.businessName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {lead.city}, {lead.state}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-2">
                            {getFollowUpBadge(lead.followUpDate)}
                            <div className="flex gap-1">
                              {lead.phone && (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={() =>
                                    window.open(`tel:${lead.phone}`)
                                  }
                                >
                                  <Phone className="h-3 w-3" />
                                </Button>
                              )}
                              {lead.email && (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={() =>
                                    window.open(`mailto:${lead.email}`)
                                  }
                                >
                                  <Mail className="h-3 w-3" />
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
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest actions on your leads</CardDescription>
              </CardHeader>
              <CardContent>
                {recentActivity.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No activity yet</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[250px]">
                    <div className="space-y-3">
                      {recentActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-3 text-sm"
                        >
                          <div className="p-1.5 rounded-full bg-muted mt-0.5">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {activity.leadName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {activity.details}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {formatDistanceToNow(new Date(activity.createdAt), {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                        </div>
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
                  <div>
                    <CardTitle>Pipeline Overview</CardTitle>
                    <CardDescription>
                      Leads distribution across stages
                    </CardDescription>
                  </div>
                  <Link href="/pipeline">
                    <Button variant="outline" size="sm">
                      View Pipeline
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {[
                    { id: 'new', label: 'New', color: 'bg-blue-500' },
                    { id: 'contacted', label: 'Contacted', color: 'bg-amber-500' },
                    { id: 'qualified', label: 'Qualified', color: 'bg-purple-500' },
                    { id: 'proposal', label: 'Proposal', color: 'bg-pink-500' },
                    { id: 'negotiation', label: 'Negotiation', color: 'bg-orange-500' },
                    { id: 'won', label: 'Won', color: 'bg-green-500' },
                    { id: 'lost', label: 'Lost', color: 'bg-gray-500' },
                  ].map((stage) => (
                    <div
                      key={stage.id}
                      className="text-center p-3 rounded-lg bg-muted/50"
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${stage.color} mx-auto mb-2`}
                      />
                      <p className="text-2xl font-bold">
                        {stageCounts[stage.id] || 0}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {stage.label}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      ) : (
        <>
          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
                <CardDescription>
                  Discover leads and add them to your pipeline
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
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
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No leads yet</h3>
                <p className="text-muted-foreground text-center mb-4 max-w-sm">
                  Start by searching for businesses in your target market. We'll
                  help you find high-intent leads ready to buy.
                </p>
                <Link href="/discover">
                  <Button>
                    <Search className="h-4 w-4 mr-2" />
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
