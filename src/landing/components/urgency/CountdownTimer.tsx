import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useCountdown } from '../../hooks/useCountdown'
import { urgencyConfig } from '../../lib/urgencyConfig'

interface CountdownTimerProps {
  endTime?: Date
  label?: string
  variant?: 'default' | 'compact' | 'urgent'
  className?: string
}

export function CountdownTimer({
  endTime = urgencyConfig.foundingMemberDeadline,
  label = 'Founding member pricing ends in',
  variant = 'default',
  className,
}: CountdownTimerProps) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(endTime)

  if (isExpired) {
    return (
      <div className={cn('text-destructive font-medium', className)}>
        Offer Expired
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-2 text-sm', className)}>
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-semibold text-hot tabular-nums">
          {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>
    )
  }

  return (
    <div className={cn(
      'text-center',
      variant === 'urgent' && 'p-4 rounded-xl bg-hot/10 border border-hot/30',
      className
    )}>
      {label && (
        <p className={cn(
          'text-sm mb-3',
          variant === 'urgent' ? 'text-hot font-medium' : 'text-muted-foreground'
        )}>
          {label}
        </p>
      )}
      <div className="flex items-center justify-center gap-3">
        <TimeUnit value={days} label="Days" variant={variant} />
        <span className="text-2xl text-muted-foreground">:</span>
        <TimeUnit value={hours} label="Hours" variant={variant} />
        <span className="text-2xl text-muted-foreground">:</span>
        <TimeUnit value={minutes} label="Min" variant={variant} />
        <span className="text-2xl text-muted-foreground">:</span>
        <TimeUnit value={seconds} label="Sec" variant={variant} />
      </div>
    </div>
  )
}

function TimeUnit({
  value,
  label,
  variant,
}: {
  value: number
  label: string
  variant: string
}) {
  return (
    <motion.div
      className="flex flex-col items-center"
      key={value}
      initial={{ scale: 1.1 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className={cn(
        'w-14 h-14 rounded-lg flex items-center justify-center font-mono text-2xl font-bold tabular-nums',
        variant === 'urgent'
          ? 'bg-hot/20 text-hot'
          : 'bg-surface text-foreground'
      )}>
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
        {label}
      </span>
    </motion.div>
  )
}
