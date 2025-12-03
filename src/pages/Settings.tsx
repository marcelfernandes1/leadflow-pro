import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, CreditCard, Bell, Shield, Zap, Mail, Calendar, TrendingUp, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

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
      toast.success(
        newValue
          ? 'Notification enabled'
          : 'Notification disabled'
      )
      return { ...prev, [key]: newValue }
    })
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-4xl"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and preferences
        </p>
      </motion.div>

      {/* Profile Section */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <CardTitle>Profile</CardTitle>
            </div>
            <CardDescription>
              Update your personal information
            </CardDescription>
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
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              <CardTitle>Subscription</CardTitle>
            </div>
            <CardDescription>
              Manage your subscription and billing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Free Plan</span>
                  <Badge variant="secondary">Current</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  100 leads/month • Basic features
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Upgrade your plan</h4>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Pro Plan */}
                <Card className="border-primary">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Pro</CardTitle>
                      <Badge className="bg-primary">Popular</Badge>
                    </div>
                    <div className="text-3xl font-bold">
                      $149
                      <span className="text-sm font-normal text-muted-foreground">
                        /month
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        1,000 leads/month
                      </li>
                      <li className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        Lead Intelligence Scoring
                      </li>
                      <li className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        Technology Gap Analysis
                      </li>
                      <li className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        AI-Powered Insights
                      </li>
                    </ul>
                    <Button className="w-full">Upgrade to Pro</Button>
                  </CardContent>
                </Card>

                {/* Agency Plan */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Agency</CardTitle>
                    <div className="text-3xl font-bold">
                      $299
                      <span className="text-sm font-normal text-muted-foreground">
                        /month
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        5,000 leads/month
                      </li>
                      <li className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        Everything in Pro
                      </li>
                      <li className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        Team Collaboration (5 users)
                      </li>
                      <li className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        API Access
                      </li>
                    </ul>
                    <Button variant="outline" className="w-full">
                      Upgrade to Agency
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Usage Section */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Usage</CardTitle>
            </div>
            <CardDescription>
              Track your monthly usage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Leads discovered</span>
                <span className="font-medium">0 / 100</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary w-0" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Searches today</span>
                <span className="font-medium">0 / 10</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary w-0" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications Section */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>
              Manage your notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Follow-up Reminders */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <Label htmlFor="followup-reminders" className="font-medium">
                    Follow-up Reminders
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when follow-ups are due
                  </p>
                </div>
              </div>
              <Switch
                id="followup-reminders"
                checked={notifications.followUpReminders}
                onCheckedChange={() => handleNotificationChange('followUpReminders')}
              />
            </div>

            <Separator />

            {/* New Lead Alerts */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <Label htmlFor="new-lead-alerts" className="font-medium">
                    New Lead Alerts
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications when new leads are added
                  </p>
                </div>
              </div>
              <Switch
                id="new-lead-alerts"
                checked={notifications.newLeadAlerts}
                onCheckedChange={() => handleNotificationChange('newLeadAlerts')}
              />
            </div>

            <Separator />

            {/* Pipeline Updates */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <MessageSquare className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <Label htmlFor="pipeline-updates" className="font-medium">
                    Pipeline Updates
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Stage changes and activity updates
                  </p>
                </div>
              </div>
              <Switch
                id="pipeline-updates"
                checked={notifications.pipelineUpdates}
                onCheckedChange={() => handleNotificationChange('pipelineUpdates')}
              />
            </div>

            <Separator />

            {/* Daily Digest */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Mail className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <Label htmlFor="daily-digest" className="font-medium">
                    Daily Digest
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Daily email summary of your pipeline
                  </p>
                </div>
              </div>
              <Switch
                id="daily-digest"
                checked={notifications.dailyDigest}
                onCheckedChange={() => handleNotificationChange('dailyDigest')}
              />
            </div>

            <Separator />

            {/* Weekly Report */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                </div>
                <div>
                  <Label htmlFor="weekly-report" className="font-medium">
                    Weekly Report
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Weekly analytics and performance report
                  </p>
                </div>
              </div>
              <Switch
                id="weekly-report"
                checked={notifications.weeklyReport}
                onCheckedChange={() => handleNotificationChange('weeklyReport')}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
