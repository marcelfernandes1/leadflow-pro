import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { urgencyConfig } from '../../lib/urgencyConfig'
import { AlertTriangle } from 'lucide-react'

interface SpotsCounterProps {
  total?: number
  remaining?: number
  label?: string
  variant?: 'default' | 'warning' | 'critical'
  className?: string
}

export function SpotsCounter({
  total = urgencyConfig.totalSpots,
  remaining = urgencyConfig.spotsRemaining,
  label = 'spots remaining at founding member pricing',
  variant,
  className,
}: SpotsCounterProps) {
  // Auto-detect variant based on remaining spots
  const autoVariant = variant || (remaining <= 50 ? 'critical' : remaining <= 100 ? 'warning' : 'default')
  const percentage = ((total - remaining) / total) * 100

  return (
    <div className={cn(
      'p-4 rounded-xl border',
      {
        'bg-surface/50 border-border/50': autoVariant === 'default',
        'bg-warm/10 border-warm/30': autoVariant === 'warning',
        'bg-hot/10 border-hot/30': autoVariant === 'critical',
      },
      className
    )}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {autoVariant === 'critical' && (
            <AlertTriangle className="w-4 h-4 text-hot animate-pulse" />
          )}
          <span className={cn(
            'text-2xl font-bold tabular-nums',
            {
              'text-foreground': autoVariant === 'default',
              'text-warm': autoVariant === 'warning',
              'text-hot': autoVariant === 'critical',
            }
          )}>
            {remaining}
          </span>
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
        <span className="text-sm text-muted-foreground tabular-nums">
          {total - remaining} / {total} claimed
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-surface rounded-full overflow-hidden">
        <motion.div
          className={cn(
            'h-full rounded-full',
            {
              'bg-primary': autoVariant === 'default',
              'bg-warm': autoVariant === 'warning',
              'bg-hot': autoVariant === 'critical',
            }
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] as const }}
        />
      </div>

      {autoVariant === 'critical' && (
        <motion.p
          className="mt-2 text-xs text-hot font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Only {remaining} spots left! Prices increase when filled.
        </motion.p>
      )}
    </div>
  )
}

// Mini inline version
export function SpotsCounterInline({
  remaining = urgencyConfig.spotsRemaining,
  className,
}: {
  remaining?: number
  className?: string
}) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 text-sm',
      remaining <= 50 ? 'text-hot' : remaining <= 100 ? 'text-warm' : 'text-muted-foreground',
      className
    )}>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
      </span>
      <span className="font-semibold tabular-nums">{remaining}</span> spots left
    </span>
  )
}
