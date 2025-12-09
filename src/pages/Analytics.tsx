import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Filter, Sparkles, Target, Zap, Flame } from 'lucide-react'
import { useLeadStore } from '@/hooks/useLeadStore'
import { getLeadCategory } from '@/lib/leadScoring'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
  },
}

// Obsidian theme colors
const STAGE_COLORS: Record<string, string> = {
  new: '#22d3ee',
  contacted: '#f59e0b',
  qualified: '#a855f7',
  proposal: '#ec4899',
  negotiation: '#f97316',
  won: '#10b981',
  lost: '#6b7280',
}

const CONTACT_COLORS = [
  '#a855f7', // violet
  '#22d3ee', // cyan
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ec4899', // pink
  '#f97316', // orange
  '#3b82f6', // blue
  '#6b7280', // gray
]

const SCORE_COLORS = {
  hot: '#ef4444', // red-500
  warm: '#f59e0b', // amber-500
  cold: '#3b82f6', // blue-500
  low: '#6b7280', // gray-500
}

const tooltipStyle = {
  backgroundColor: 'hsl(240 10% 11%)',
  border: '1px solid hsl(240 10% 18%)',
  borderRadius: '12px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
}

export default function Analytics() {
  const { pipelineLeads, discoveredLeads } = useLeadStore()

  const funnelData = useMemo(() => {
    const stages = [
      { id: 'new', name: 'New Leads', fill: STAGE_COLORS.new },
      { id: 'contacted', name: 'Contacted', fill: STAGE_COLORS.contacted },
      { id: 'qualified', name: 'Qualified', fill: STAGE_COLORS.qualified },
      { id: 'proposal', name: 'Proposal', fill: STAGE_COLORS.proposal },
      { id: 'negotiation', name: 'Negotiation', fill: STAGE_COLORS.negotiation },
      { id: 'won', name: 'Won', fill: STAGE_COLORS.won },
    ]
    return stages.map((stage) => ({
      ...stage,
      value: pipelineLeads.filter((l) => l.stage === stage.id).length,
    }))
  }, [pipelineLeads])

  const pipelineBarData = useMemo(() => {
    const stages = [
      { id: 'new', name: 'New' },
      { id: 'contacted', name: 'Contacted' },
      { id: 'qualified', name: 'Qualified' },
      { id: 'proposal', name: 'Proposal' },
      { id: 'negotiation', name: 'Negotiation' },
      { id: 'won', name: 'Won' },
      { id: 'lost', name: 'Lost' },
    ]
    return stages.map((stage) => ({
      name: stage.name,
      count: pipelineLeads.filter((l) => l.stage === stage.id).length,
      fill: STAGE_COLORS[stage.id],
    }))
  }, [pipelineLeads])

  const contactMethodData = useMemo(() => {
    const methods: Record<string, number> = {}
    pipelineLeads.forEach((lead) => {
      lead.activities?.forEach((activity) => {
        if (activity.type === 'contacted' && activity.details) {
          const method = activity.details.replace('Contacted via ', '')
          methods[method] = (methods[method] || 0) + 1
        }
      })
    })
    return Object.entries(methods).map(([name, value], index) => ({
      name,
      value,
      fill: CONTACT_COLORS[index % CONTACT_COLORS.length],
    }))
  }, [pipelineLeads])

  const conversionRates = useMemo(() => {
    const total = pipelineLeads.length
    if (total === 0) return { contactRate: 0, qualifyRate: 0, winRate: 0 }
    const contacted = pipelineLeads.filter((l) => l.stage !== 'new').length
    const qualified = pipelineLeads.filter((l) => !['new', 'contacted'].includes(l.stage)).length
    const won = pipelineLeads.filter((l) => l.stage === 'won').length
    return {
      contactRate: Math.round((contacted / total) * 100),
      qualifyRate: contacted > 0 ? Math.round((qualified / contacted) * 100) : 0,
      winRate: qualified > 0 ? Math.round((won / qualified) * 100) : 0,
    }
  }, [pipelineLeads])

  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {}
    discoveredLeads.forEach((lead) => {
      const category = lead.category || 'Other'
      categories[category] = (categories[category] || 0) + 1
    })
    return Object.entries(categories)
      .map(([name, value], index) => ({
        name: name.length > 15 ? name.substring(0, 15) + '...' : name,
        value,
        fill: CONTACT_COLORS[index % CONTACT_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)
  }, [discoveredLeads])

  const scoreDistributionData = useMemo(() => {
    const leadsWithScores = discoveredLeads.filter((lead) => lead.leadScore !== undefined)
    if (leadsWithScores.length === 0) return []

    const distribution = { hot: 0, warm: 0, cold: 0, low: 0 }
    leadsWithScores.forEach((lead) => {
      const category = getLeadCategory(lead.leadScore!)
      distribution[category]++
    })

    return [
      { name: 'Hot', value: distribution.hot, fill: SCORE_COLORS.hot },
      { name: 'Warm', value: distribution.warm, fill: SCORE_COLORS.warm },
      { name: 'Cold', value: distribution.cold, fill: SCORE_COLORS.cold },
      { name: 'Low', value: distribution.low, fill: SCORE_COLORS.low },
    ].filter((item) => item.value > 0)
  }, [discoveredLeads])

  const hasData = pipelineLeads.length > 0 || discoveredLeads.length > 0

  const stats = [
    {
      label: 'Contact Rate',
      value: `${conversionRates.contactRate}%`,
      description: 'Leads contacted from pipeline',
      gradient: 'from-cold to-blue-500',
      glow: 'shadow-cold/20',
      icon: TrendingUp,
    },
    {
      label: 'Qualification Rate',
      value: `${conversionRates.qualifyRate}%`,
      description: 'Contacted leads that qualified',
      gradient: 'from-primary to-purple-500',
      glow: 'shadow-primary/20',
      icon: Target,
    },
    {
      label: 'Win Rate',
      value: `${conversionRates.winRate}%`,
      description: 'Qualified leads that closed',
      gradient: 'from-success to-green-500',
      glow: 'shadow-success/20',
      icon: Zap,
    },
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-semibold tracking-tight">Analytics</h1>
          <Badge variant="glow">
            <Sparkles className="w-3 h-3 mr-1" />
            Real-time
          </Badge>
        </div>
        <p className="text-muted-foreground mt-1 text-lg">
          Track your lead generation and sales performance
        </p>
      </motion.div>

      {hasData ? (
        <>
          {/* Conversion Rate Cards */}
          <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-3">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="relative overflow-hidden group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg bg-gradient-to-br ${stat.gradient} shadow-lg ${stat.glow}`}>
                        <stat.icon className="h-3.5 w-3.5 text-white" />
                      </div>
                      {stat.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-4xl font-semibold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                      {stat.value}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Charts Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Pipeline Distribution */}
            <motion.div variants={itemVariants}>
              <Card variant="default" className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <BarChart3 className="h-5 w-5 text-primary" />
                    </div>
                    Pipeline Distribution
                  </CardTitle>
                  <CardDescription>Leads count by stage</CardDescription>
                </CardHeader>
                <CardContent>
                  {pipelineLeads.length === 0 ? (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      <p>Add leads to pipeline to see distribution</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={pipelineBarData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 18%)" horizontal={true} vertical={false} />
                        <XAxis type="number" stroke="hsl(240 5% 45%)" fontSize={12} />
                        <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12, fill: 'hsl(240 5% 65%)' }} stroke="hsl(240 5% 45%)" />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(240 10% 14% / 0.5)' }} />
                        <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                          {pipelineBarData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Methods */}
            <motion.div variants={itemVariants}>
              <Card variant="default" className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-cold/10">
                      <PieChartIcon className="h-5 w-5 text-cold" />
                    </div>
                    Contact Methods
                  </CardTitle>
                  <CardDescription>How you reach out to leads</CardDescription>
                </CardHeader>
                <CardContent>
                  {contactMethodData.length === 0 ? (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      <p>Contact leads to see breakdown</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={contactMethodData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={110}
                          paddingAngle={3}
                          dataKey="value"
                          label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                          labelLine={false}
                          stroke="hsl(240 10% 6%)"
                          strokeWidth={2}
                        >
                          {contactMethodData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Lead Categories */}
            <motion.div variants={itemVariants}>
              <Card variant="default" className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-warm/10">
                      <Filter className="h-5 w-5 text-warm" />
                    </div>
                    Lead Categories
                  </CardTitle>
                  <CardDescription>Top categories from discovered leads</CardDescription>
                </CardHeader>
                <CardContent>
                  {categoryData.length === 0 ? (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      <p>Discover leads to see categories</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={categoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 18%)" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(240 5% 65%)' }} angle={-45} textAnchor="end" height={80} stroke="hsl(240 5% 45%)" />
                        <YAxis stroke="hsl(240 5% 45%)" tick={{ fill: 'hsl(240 5% 65%)' }} />
                        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(240 10% 14% / 0.5)' }} />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Conversion Funnel */}
            <motion.div variants={itemVariants}>
              <Card variant="default" className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-success/10">
                      <TrendingUp className="h-5 w-5 text-success" />
                    </div>
                    Conversion Funnel
                  </CardTitle>
                  <CardDescription>Lead progression through stages</CardDescription>
                </CardHeader>
                <CardContent>
                  {pipelineLeads.length === 0 ? (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      <p>Add leads to pipeline to see funnel</p>
                    </div>
                  ) : (
                    <div className="h-[300px] flex flex-col justify-center gap-3">
                      {funnelData.map((stage, index) => {
                        const maxValue = Math.max(...funnelData.map(s => s.value), 1)
                        const width = Math.max((stage.value / maxValue) * 100, 10)
                        return (
                          <div key={stage.id} className="flex items-center gap-4">
                            <div className="w-24 text-xs text-right text-muted-foreground">{stage.name}</div>
                            <div className="flex-1 h-10 bg-surface rounded-lg overflow-hidden border border-border/30">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${width}%` }}
                                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
                                className="h-full flex items-center justify-end pr-3 text-white text-sm font-medium rounded-lg"
                                style={{ background: `linear-gradient(90deg, ${stage.fill}99, ${stage.fill})` }}
                              >
                                {stage.value}
                              </motion.div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Lead Score Distribution */}
            <motion.div variants={itemVariants}>
              <Card variant="default" className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-orange-500/10">
                      <Flame className="h-5 w-5 text-orange-500" />
                    </div>
                    Lead Score Distribution
                  </CardTitle>
                  <CardDescription>Breakdown of leads by intelligence score</CardDescription>
                </CardHeader>
                <CardContent>
                  {scoreDistributionData.length === 0 ? (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      <p>Score leads to see distribution</p>
                    </div>
                  ) : (
                    <div className="h-[300px] flex items-center">
                      <ResponsiveContainer width="60%" height="100%">
                        <PieChart>
                          <Pie
                            data={scoreDistributionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="hsl(240 10% 6%)"
                            strokeWidth={2}
                          >
                            {scoreDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={tooltipStyle} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex-1 space-y-3">
                        {scoreDistributionData.map((item, index) => (
                          <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.fill }}
                              />
                              <span className="text-sm font-medium">{item.name}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {item.value} lead{item.value !== 1 ? 's' : ''}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </>
      ) : (
        <motion.div variants={itemVariants}>
          <Card className="border-dashed border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="relative mb-6">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-cold/10 border border-border/30">
                  <BarChart3 className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-primary/20 to-cold/20 blur-xl opacity-50" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No data yet</h3>
              <p className="text-muted-foreground text-center mb-4 max-w-sm">
                Start discovering leads and adding them to your pipeline to see analytics and performance metrics.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}
