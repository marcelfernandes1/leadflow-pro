import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { X, AlertTriangle } from 'lucide-react'
import { backdropVariants, scaleInBounce } from '../../lib/animations'
import { urgencyConfig } from '../../lib/urgencyConfig'

interface ExitIntentPopupProps {
  isOpen: boolean
  onClose: () => void
  onCtaClick: () => void
}

export function ExitIntentPopup({ isOpen, onClose, onCtaClick }: ExitIntentPopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-lg bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden"
            variants={scaleInBounce}
          >
            {/* Top urgency bar */}
            <div className="bg-hot/20 border-b border-hot/30 px-6 py-3 flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4 text-hot" />
              <span className="text-sm font-medium text-hot">WAIT! Before you go...</span>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-12 right-4 text-muted-foreground hover:text-foreground transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Are you really going to keep guessing which leads will close?
              </h2>

              <p className="text-muted-foreground mb-4">
                We get it. You're busy. You've seen a lot of tools.
              </p>

              <p className="text-foreground mb-6">
                But here's the thing:
              </p>

              <div className="bg-surface/50 border border-border/50 rounded-xl p-4 mb-6">
                <p className="text-sm text-muted-foreground mb-1">
                  Every day you wait is another
                </p>
                <p className="text-3xl font-bold text-hot tabular-nums">
                  ${urgencyConfig.lossCalculations.dailyLostRevenue}
                </p>
                <p className="text-sm text-muted-foreground">
                  in lost revenue. That's{' '}
                  <span className="text-hot font-semibold">
                    ${urgencyConfig.lossCalculations.monthlyLostRevenue.toLocaleString()}
                  </span>{' '}
                  this month alone.
                </p>
              </div>

              <p className="text-foreground font-medium mb-6">
                Just try the free tier. 60 seconds. No credit card.
                <br />
                <span className="text-muted-foreground font-normal">
                  See your first scored leads before you go.
                </span>
              </p>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Button
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/20"
                  onClick={onCtaClick}
                >
                  Show Me My Hot Leads
                </Button>

                <button
                  onClick={onClose}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  No thanks, I'll keep guessing which leads will close
                </button>
              </div>
            </div>

            {/* Bottom social proof */}
            <div className="bg-surface/30 border-t border-border/30 px-6 py-3 text-center">
              <p className="text-xs text-muted-foreground">
                <span className="text-foreground font-medium">2,847 agencies</span> already use LeadFlow Pro.
                Your competitors might be among them.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
