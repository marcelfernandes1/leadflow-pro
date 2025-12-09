import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useScrollTrigger } from '../../hooks/useScrollPosition'
import { X, Zap } from 'lucide-react'
import { useState } from 'react'
import { slideInFromBottom } from '../../lib/animations'
import { urgencyConfig } from '../../lib/urgencyConfig'

interface ScrollTriggeredBarProps {
  threshold?: number
  className?: string
  onCtaClick: () => void
}

export function ScrollTriggeredBar({
  threshold = 25,
  className,
  onCtaClick,
}: ScrollTriggeredBarProps) {
  const { triggered } = useScrollTrigger(threshold)
  const [dismissed, setDismissed] = useState(false)

  const showBar = triggered && !dismissed

  return (
    <AnimatePresence>
      {showBar && (
        <motion.div
          className={cn(
            'fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-t border-border/50 shadow-2xl shadow-black/20',
            className
          )}
          variants={slideInFromBottom}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              {/* Left side - Message */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-hot/20">
                  <Zap className="w-5 h-5 text-hot" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    <span className="text-hot tabular-nums">{urgencyConfig.metrics.leadsScored.toLocaleString()}</span>{' '}
                    leads scored today
                  </p>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    Start free - see which leads will actually close
                  </p>
                </div>
              </div>

              {/* Right side - CTA and dismiss */}
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  onClick={onCtaClick}
                  className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 whitespace-nowrap"
                >
                  Start Free
                </Button>
                <button
                  onClick={() => setDismissed(true)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Slide-in from right (less intrusive)
export function ScrollTriggeredSlideIn({
  threshold = 50,
  className,
  onCtaClick,
}: ScrollTriggeredBarProps) {
  const { triggered } = useScrollTrigger(threshold)
  const [dismissed, setDismissed] = useState(false)

  const showSlide = triggered && !dismissed

  return (
    <AnimatePresence>
      {showSlide && (
        <motion.div
          className={cn(
            'fixed bottom-4 right-4 z-40 max-w-sm bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl p-4',
            className
          )}
          initial={{ opacity: 0, x: 100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="pr-6">
            <h4 className="font-semibold text-foreground mb-2">
              Quick question:
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              What if you could see exactly which leads were ready to buy BEFORE you reached out?
            </p>
            <p className="text-sm text-foreground font-medium mb-4">
              Would that change your business?
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={onCtaClick}
                className="flex-1"
              >
                Yes, Show Me
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setDismissed(true)}
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
