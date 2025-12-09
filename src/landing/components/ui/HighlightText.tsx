import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface HighlightTextProps {
  children: React.ReactNode
  variant?: 'yellow' | 'brand' | 'hot' | 'success'
  className?: string
  animated?: boolean
}

export function HighlightText({
  children,
  variant = 'yellow',
  className,
  animated = false,
}: HighlightTextProps) {
  const variants = {
    yellow: 'bg-yellow-500/20 text-yellow-300',
    brand: 'bg-primary/20 text-primary',
    hot: 'bg-hot/20 text-hot',
    success: 'bg-success/20 text-success',
  }

  if (animated) {
    return (
      <motion.mark
        className={cn(
          'px-1 py-0.5 rounded not-italic',
          variants[variant],
          className
        )}
        initial={{ backgroundSize: '0% 100%' }}
        whileInView={{ backgroundSize: '100% 100%' }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }}
        style={{
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '0 0',
        }}
      >
        {children}
      </motion.mark>
    )
  }

  return (
    <mark className={cn(
      'px-1 py-0.5 rounded not-italic',
      variants[variant],
      className
    )}>
      {children}
    </mark>
  )
}

// Strikethrough with replacement
export function StrikethroughReplace({
  original,
  replacement,
  className,
}: {
  original: string
  replacement: string
  className?: string
}) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span className="line-through text-muted-foreground">{original}</span>
      <span className="text-success font-semibold">{replacement}</span>
    </span>
  )
}
