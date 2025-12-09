import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles,
  Zap,
  TrendingUp,
  Target,
  Brain,
  CheckCircle2,
  ArrowRight,
  Crown,
} from 'lucide-react'

interface ProUpgradeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpgrade?: () => void
}

const features = [
  {
    icon: Brain,
    title: 'AI Lead Scoring',
    description: 'Automatically score leads 0-100 based on buying signals',
  },
  {
    icon: Target,
    title: 'Opportunity Analysis',
    description: 'Identify exactly what services each lead needs',
  },
  {
    icon: TrendingUp,
    title: 'Growth Signals',
    description: 'Detect hiring, funding, and expansion signals',
  },
  {
    icon: Zap,
    title: 'AI Pitch Generator',
    description: 'Get personalized pitch recommendations for each lead',
  },
]

export function ProUpgradeModal({
  open,
  onOpenChange,
  onUpgrade,
}: ProUpgradeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center pb-2">
          <div className="mx-auto mb-4 relative">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="p-4 rounded-2xl bg-gradient-to-br from-primary to-cold shadow-xl shadow-primary/30"
            >
              <Crown className="h-8 w-8 text-white" />
            </motion.div>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="absolute -top-1 -right-1"
            >
              <Badge variant="glow" className="text-2xs px-1.5">
                PRO
              </Badge>
            </motion.div>
          </div>
          <DialogTitle className="text-2xl font-semibold">
            Unlock Pro Intelligence
          </DialogTitle>
          <DialogDescription className="text-base">
            Get AI-powered insights to close more deals
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Features */}
          <div className="space-y-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-surface/50 backdrop-blur-sm border border-border/40"
              >
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-cold/20">
                  <feature.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pricing */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-cold/10 border border-primary/20 text-center"
          >
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl font-semibold">$49</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Cancel anytime. 7-day free trial.
            </p>
          </motion.div>

          {/* Benefits */}
          <div className="space-y-2">
            {[
              '1,000 leads per month',
              '50 searches per day',
              'Full intelligence analysis',
              'Priority support',
            ].map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="flex items-center gap-2 text-sm"
              >
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span>{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Button
            className="w-full gap-2 bg-gradient-to-r from-primary to-cold hover:from-primary/90 hover:to-cold/90"
            size="lg"
            onClick={() => {
              onUpgrade?.()
              onOpenChange(false)
            }}
          >
            <Sparkles className="h-4 w-4" />
            Start Free Trial
            <ArrowRight className="h-4 w-4 ml-auto" />
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
