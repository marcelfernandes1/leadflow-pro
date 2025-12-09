import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, CreditCard, Bell, Shield, Mail, Calendar, TrendingUp, MessageSquare, Crown, Sparkles, Check } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

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

interface NotificationSettings {
  followUpReminders: boolean
  dailyDigest: boolean
  newLeadAlerts: boolean
  pipelineUpdates: boolean
  weeklyReport: boolean
}

export default function Settings() {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    followUpReminders: true,
    dailyDigest: false,
    newLeadAlerts: true,
    pipelineUpdates: true,
    weeklyReport: false,
  })

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications((prev) => {
      const newValue = !prev[key]
      toast.success(newValue ? 'Notification enabled' : 'Notification disabled')
      return { ...prev, [key]: newValue }
    })
  }

  const notificationItems = [
    {
      id: 'followUpReminders',
      icon: Calendar,
      label: 'Follow-up Reminders',
      description: 'Get notified when follow-ups are due',
      color: 'violet',
      bgColor: 'bg-primary/10',
    },
    {
      id: 'newLeadAlerts',
      icon: TrendingUp,
      label: 'New Lead Alerts',
      description: 'Notifications when new leads are added',
      color: 'emerald',
      bgColor: 'bg-success/10',
    },
    {
      id: 'pipelineUpdates',
      icon: MessageSquare,
      label: 'Pipeline Updates',
      description: 'Stage changes and activity updates',
      color: 'amber',
      bgColor: 'bg-warm/10',
    },
    {
      id: 'dailyDigest',
      icon: Mail,
      label: 'Daily Digest',
      description: 'Daily email summary of your pipeline',
      color: 'cyan',
      bgColor: 'bg-cold/10',
    },
    {
      id: 'weeklyReport',
      icon: TrendingUp,
      label: 'Weekly Report',
      description: 'Weekly analytics and performance report',
      color: 'rose',
      bgColor: 'bg-hot/10',
    },
  ] as const

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-4xl"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-semibold tracking-tight">Settings</h1>
        </div>
        <p className="text-muted-foreground mt-1 text-lg">
          Manage your account and preferences
        </p>
      </motion.div>

      {/* Profile Section */}
      <motion.div variants={itemVariants}>
        <Card variant="default">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" placeholder="Your company name" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Subscription Section */}
      <motion.div variants={itemVariants}>
        <Card variant="default">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cold/10">
                <CreditCard className="h-5 w-5 text-cold" />
              </div>
              <div>
                <CardTitle>Subscription</CardTitle>
                <CardDescription>Manage your subscription and billing</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Plan */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface border border-border/30">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Free Plan</span>
                  <Badge variant="default">Current</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  100 leads/month • Basic features
                </p>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Upgrade Plans */}
            <div className="space-y-4">
              <h4 className="font-semibold">Upgrade your plan</h4>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Pro Plan */}
                <Card hover className="relative overflow-hidden border-primary/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                  <CardHeader className="pb-4 relative">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Crown className="h-5 w-5 text-primary" />
                        Pro
                      </CardTitle>
                      <Badge variant="glow">Popular</Badge>
                    </div>
                    <div className="text-4xl font-semibold mt-2">
                      <span className="text-gradient-brand">$149</span>
                      <span className="text-sm font-normal text-muted-foreground">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 relative">
                    <ul className="space-y-2.5 text-sm">
                      {['1,000 leads/month', 'Lead Intelligence Scoring', 'Technology Gap Analysis', 'AI-Powered Insights'].map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <div className="p-0.5 rounded-full bg-primary/20">
                            <Check className="h-3 w-3 text-primary" />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full">Upgrade to Pro</Button>
                  </CardContent>
                </Card>

                {/* Agency Plan */}
                <Card hover className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cold/5 to-transparent" />
                  <CardHeader className="pb-4 relative">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-cold" />
                      Agency
                    </CardTitle>
                    <div className="text-4xl font-semibold mt-2">
                      <span className="bg-gradient-to-r from-cold to-blue-500 bg-clip-text text-transparent">$299</span>
                      <span className="text-sm font-normal text-muted-foreground">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 relative">
                    <ul className="space-y-2.5 text-sm">
                      {['5,000 leads/month', 'Everything in Pro', 'Team Collaboration (5 users)', 'API Access'].map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <div className="p-0.5 rounded-full bg-cold/20">
                            <Check className="h-3 w-3 text-cold" />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" className="w-full">Upgrade to Agency</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Usage Section */}
      <motion.div variants={itemVariants}>
        <Card variant="default">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warm/10">
                <Shield className="h-5 w-5 text-warm" />
              </div>
              <div>
                <CardTitle>Usage</CardTitle>
                <CardDescription>Track your monthly usage</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Leads discovered</span>
                <span className="font-mono font-medium">0 / 100</span>
              </div>
              <div className="h-2.5 bg-surface rounded-full overflow-hidden border border-border/30">
                <div className="h-full w-0 bg-gradient-to-r from-primary to-cold rounded-full" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Searches today</span>
                <span className="font-mono font-medium">0 / 10</span>
              </div>
              <div className="h-2.5 bg-surface rounded-full overflow-hidden border border-border/30">
                <div className="h-full w-0 bg-gradient-to-r from-success to-green-500 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications Section */}
      <motion.div variants={itemVariants}>
        <Card variant="default">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Bell className="h-5 w-5 text-success" />
              </div>
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage your notification preferences</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            {notificationItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-surface transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${item.bgColor} transition-transform group-hover:scale-105`}>
                      <item.icon className={`h-4 w-4 text-${item.color}`} />
                    </div>
                    <div>
                      <Label htmlFor={item.id} className="font-medium cursor-pointer">
                        {item.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <Switch
                    id={item.id}
                    checked={notifications[item.id]}
                    onCheckedChange={() => handleNotificationChange(item.id)}
                  />
                </div>
                {index < notificationItems.length - 1 && (
                  <div className="mx-3 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />
                )}
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
