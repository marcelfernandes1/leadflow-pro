import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useLiveActivity } from '../../hooks/useLiveActivity'
import { notificationPop } from '../../lib/animations'
import { X, CheckCircle, Zap, TrendingUp } from 'lucide-react'
import { useState } from 'react'

interface LiveActivityFeedProps {
  position?: 'bottom-left' | 'bottom-right'
  className?: string
}

export function LiveActivityFeed({
  position = 'bottom-left',
  className,
}: LiveActivityFeedProps) {
  const { currentActivity } = useLiveActivity(20000) // New activity every 20s
  const [dismissed, setDismissed] = useState(false)

  if (!currentActivity || dismissed) return null

  const getIcon = () => {
    if (currentActivity.action.includes('closed')) return TrendingUp
    if (currentActivity.action.includes('upgraded')) return Zap
    return CheckCircle
  }

  const Icon = getIcon()

  return (
    <AnimatePresence>
      <motion.div
        key={currentActivity.id}
        className={cn(
          'fixed z-50 max-w-sm',
          position === 'bottom-left' ? 'bottom-4 left-4' : 'bottom-4 right-4',
          className
        )}
        variants={notificationPop}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="relative bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl p-4 shadow-xl">
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3 pr-6">
            <div className="flex-shrink-0 p-2 rounded-lg bg-success/10">
              <Icon className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="text-sm text-foreground">
                <span className="font-semibold">{currentActivity.name}</span>
                {' '}{currentActivity.action}
                {currentActivity.value && (
                  <span className="text-success font-semibold"> ({currentActivity.value})</span>
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {currentActivity.location} · just now
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Floating notification bar (appears at top)
export function LiveActivityBar({ className }: { className?: string }) {
  const { currentActivity } = useLiveActivity(15000)

  return (
    <AnimatePresence mode="wait">
      {currentActivity && (
        <motion.div
          key={currentActivity.id}
          className={cn(
            'bg-success/10 border-b border-success/20 py-2 px-4 text-center text-sm',
            className
          )}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-muted-foreground">
            🎉 <span className="font-semibold text-foreground">{currentActivity.name}</span>
            {' from '}{currentActivity.location}{' '}{currentActivity.action}
            {currentActivity.value && (
              <span className="text-success font-semibold"> ({currentActivity.value})</span>
            )}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
