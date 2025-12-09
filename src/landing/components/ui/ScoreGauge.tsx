import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { easing } from '../../lib/animations'

interface ScoreGaugeProps {
  score: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showLabel?: boolean
  animated?: boolean
  className?: string
}

const sizes = {
  sm: { width: 60, stroke: 4, fontSize: 'text-sm' },
  md: { width: 80, stroke: 5, fontSize: 'text-lg' },
  lg: { width: 120, stroke: 6, fontSize: 'text-2xl' },
  xl: { width: 160, stroke: 8, fontSize: 'text-4xl' },
}

export function ScoreGauge({
  score,
  size = 'md',
  showLabel = true,
  animated = true,
  className,
}: ScoreGaugeProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const { width, stroke, fontSize } = sizes[size]
  const radius = (width - stroke) / 2
  const circumference = radius * 2 * Math.PI
  const progress = animated && isInView ? score / 100 : 0

  // Determine color based on score
  const getColor = () => {
    if (score >= 90) return { main: 'hsl(var(--hot))', bg: 'hsl(var(--hot) / 0.15)' }
    if (score >= 70) return { main: 'hsl(var(--warm))', bg: 'hsl(var(--warm) / 0.15)' }
    if (score >= 50) return { main: 'hsl(var(--cold))', bg: 'hsl(var(--cold) / 0.15)' }
    return { main: 'hsl(var(--muted-foreground))', bg: 'hsl(var(--muted) / 0.15)' }
  }

  const colors = getColor()

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        ref={ref}
        width={width}
        height={width}
        viewBox={`0 0 ${width} ${width}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke={colors.bg}
          strokeWidth={stroke}
        />
        {/* Progress circle */}
        <motion.circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke={colors.main}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: animated && isInView
              ? circumference - progress * circumference
              : circumference
          }}
          transition={{
            duration: 1.5,
            ease: easing.smooth,
            delay: 0.3,
          }}
          style={{
            filter: `drop-shadow(0 0 8px ${colors.main})`
          }}
        />
      </svg>

      {showLabel && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <span className={cn('font-bold tabular-nums', fontSize)} style={{ color: colors.main }}>
            {animated ? (isInView ? score : 0) : score}
          </span>
          {size !== 'sm' && (
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Score</span>
          )}
        </motion.div>
      )}
    </div>
  )
}

// Mini inline score badge
export function ScoreBadge({ score, className }: { score: number; className?: string }) {
  const getVariant = () => {
    if (score >= 90) return 'bg-hot/20 text-hot border-hot/30'
    if (score >= 70) return 'bg-warm/20 text-warm border-warm/30'
    if (score >= 50) return 'bg-cold/20 text-cold border-cold/30'
    return 'bg-muted/20 text-muted-foreground border-muted/30'
  }

  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border',
      getVariant(),
      className
    )}>
      {score >= 90 && '🔥'} {score}
    </span>
  )
}
