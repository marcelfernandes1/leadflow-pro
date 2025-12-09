import { useEffect, useRef, useState } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimatedCounterProps {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
  delay?: number
  className?: string
  decimals?: number
  separator?: boolean
}

export function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  duration = 2,
  delay = 0,
  className,
  decimals = 0,
  separator = true,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true

      const timeout = setTimeout(() => {
        animate(0, value, {
          duration,
          ease: [0.4, 0, 0.2, 1],
          onUpdate: (latest) => {
            setDisplayValue(latest)
          },
        })
      }, delay * 1000)

      return () => clearTimeout(timeout)
    }
  }, [isInView, value, duration, delay])

  const formattedValue = decimals > 0
    ? displayValue.toFixed(decimals)
    : separator
      ? Math.round(displayValue).toLocaleString()
      : Math.round(displayValue).toString()

  return (
    <motion.span
      ref={ref}
      className={cn('tabular-nums', className)}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      {prefix}{formattedValue}{suffix}
    </motion.span>
  )
}

// Compact version for inline numbers
export function InlineCounter({
  value,
  className,
}: {
  value: number
  className?: string
}) {
  return (
    <AnimatedCounter
      value={value}
      duration={1.5}
      className={cn('font-semibold text-primary', className)}
    />
  )
}
