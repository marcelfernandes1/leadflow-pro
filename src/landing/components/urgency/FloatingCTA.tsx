import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useScrollPosition } from '../../hooks/useScrollPosition'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'

interface FloatingCTAProps {
  showAfterPercent?: number
  hideAfterPercent?: number
  className?: string
  onCtaClick: () => void
}

export function FloatingCTA({
  showAfterPercent = 10,
  hideAfterPercent = 95,
  className,
  onCtaClick,
}: FloatingCTAProps) {
  const { scrollPercent } = useScrollPosition()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const shouldShow = scrollPercent > showAfterPercent && scrollPercent < hideAfterPercent
    setVisible(shouldShow)
  }, [scrollPercent, showAfterPercent, hideAfterPercent])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={cn(
            'fixed bottom-6 left-1/2 z-40',
            className
          )}
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <Button
            size="lg"
            onClick={onCtaClick}
            className="bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/30 group px-8"
          >
            <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
            Show Me My Hot Leads
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Mobile-specific sticky CTA
export function MobileStickyCTA({
  className,
  onCtaClick,
}: {
  className?: string
  onCtaClick: () => void
}) {
  return (
    <div className={cn(
      'fixed bottom-0 left-0 right-0 z-40 p-4 bg-gradient-to-t from-void via-void/95 to-transparent md:hidden',
      className
    )}>
      <Button
        size="lg"
        onClick={onCtaClick}
        className="w-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/20"
      >
        Start Free - See Your Hot Leads
      </Button>
    </div>
  )
}
