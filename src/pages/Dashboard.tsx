import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search, Users, Target, TrendingUp } from 'lucide-react'
import { Link } from 'wouter'

const stats = [
  {
    name: 'Total Leads',
    value: '0',
    description: 'Leads discovered',
    icon: Users,
    color: 'text-blue-500',
  },
  {
    name: 'In Pipeline',
    value: '0',
    description: 'Active prospects',
    icon: Target,
    color: 'text-green-500',
  },
  {
    name: 'Contacted',
    value: '0',
    description: 'This month',
    icon: TrendingUp,
    color: 'text-amber-500',
  },
]

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
        className="grid gap-4 md:grid-cols-3"
      >
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
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
              Start by searching for businesses in your target market. We'll help you find high-intent leads ready to buy.
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
    </motion.div>
  )
}
