import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Filter } from 'lucide-react'
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

const STAGE_COLORS: Record<string, string> = {
  new: '#3b82f6',
  contacted: '#f59e0b',
  qualified: '#8b5cf6',
  proposal: '#ec4899',
  negotiation: '#f97316',
  won: '#22c55e',
  lost: '#6b7280',
}

const CONTACT_COLORS = [
  '#3b82f6', // blue
  '#22c55e', // green
  '#f59e0b', // amber
  '#ec4899', // pink
  '#8b5cf6', // purple
  '#f97316', // orange
  '#06b6d4', // cyan
  '#6b7280', // gray
]

export default function Analytics() {
  const { pipelineLeads, discoveredLeads } = useLeadStore()

  // Pipeline funnel data
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

  // Pipeline bar chart data
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

  // Contact method breakdown
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

  // Conversion rates
  const conversionRates = useMemo(() => {
    const total = pipelineLeads.length
    if (total === 0) return { contactRate: 0, qualifyRate: 0, winRate: 0 }

    const contacted = pipelineLeads.filter(
      (l) => l.stage !== 'new'
    ).length
    const qualified = pipelineLeads.filter(
      (l) => !['new', 'contacted'].includes(l.stage)
    ).length
    const won = pipelineLeads.filter((l) => l.stage === 'won').length

    return {
      contactRate: Math.round((contacted / total) * 100),
      qualifyRate: contacted > 0 ? Math.round((qualified / contacted) * 100) : 0,
      winRate: qualified > 0 ? Math.round((won / qualified) * 100) : 0,
    }
  }, [pipelineLeads])

  // Category breakdown of discovered leads
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
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Track your lead generation and sales performance.
        </p>
      </motion.div>

      {hasData ? (
        <>
          {/* Conversion Rate Cards */}
          <motion.div
            variants={itemVariants}
            className="grid gap-4 md:grid-cols-3"
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Contact Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-500">
                  {conversionRates.contactRate}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Leads contacted from pipeline
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Qualification Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-500">
                  {conversionRates.qualifyRate}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Contacted leads that qualified
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Win Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">
                  {conversionRates.winRate}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Qualified leads that closed
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Charts Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Pipeline Distribution */}
            <motion.div variants={itemVariants}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Pipeline Distribution
                  </CardTitle>
                  <CardDescription>
                    Leads count by stage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {pipelineLeads.length === 0 ? (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      <p>Add leads to pipeline to see distribution</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={pipelineBarData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={80}
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
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
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    Contact Methods
                  </CardTitle>
                  <CardDescription>
                    How you reach out to leads
                  </CardDescription>
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
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }: { name?: string; percent?: number }) =>
                            `${name ?? ''} (${((percent ?? 0) * 100).toFixed(0)}%)`
                          }
                          labelLine={false}
                        >
                          {contactMethodData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Lead Categories */}
            <motion.div variants={itemVariants}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Lead Categories
                  </CardTitle>
                  <CardDescription>
                    Top categories from discovered leads
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {categoryData.length === 0 ? (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      <p>Discover leads to see categories</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={categoryData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 10 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
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
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Conversion Funnel
                  </CardTitle>
                  <CardDescription>
                    Lead progression through stages
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {pipelineLeads.length === 0 ? (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      <p>Add leads to pipeline to see funnel</p>
                    </div>
                  ) : (
                    <div className="h-[300px] flex flex-col justify-center gap-2">
                      {funnelData.map((stage, index) => {
                        const maxValue = Math.max(...funnelData.map(s => s.value), 1)
                        const width = Math.max((stage.value / maxValue) * 100, 10)
                        return (
                          <div key={stage.id} className="flex items-center gap-3">
                            <div className="w-24 text-xs text-right text-muted-foreground">
                              {stage.name}
                            </div>
                            <div className="flex-1 h-8 bg-muted rounded-md overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${width}%` }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="h-full flex items-center justify-end pr-2 text-white text-xs font-medium"
                                style={{ backgroundColor: stage.fill }}
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
          </div>
        </>
      ) : (
        <motion.div variants={itemVariants}>
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-muted p-4 mb-4">
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No data yet</h3>
              <p className="text-muted-foreground text-center mb-4 max-w-sm">
                Start discovering leads and adding them to your pipeline to see
                analytics and performance metrics.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}
