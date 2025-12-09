import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import { cardHover } from '../../lib/animations'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  value?: string
  className?: string
  variant?: 'default' | 'highlighted' | 'glass'
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  value,
  className,
  variant = 'default',
}: FeatureCardProps) {
  return (
    <motion.div
      className={cn(
        'relative p-6 rounded-xl border transition-all duration-200',
        {
          'bg-card/70 backdrop-blur-xl border-border/50': variant === 'default',
          'bg-primary/10 backdrop-blur-xl border-primary/30': variant === 'highlighted',
          'bg-card/40 backdrop-blur-2xl border-border/30': variant === 'glass',
        },
        className
      )}
      variants={cardHover}
      initial="rest"
      whileHover="hover"
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          'flex-shrink-0 p-3 rounded-lg',
          variant === 'highlighted' ? 'bg-primary/20' : 'bg-surface'
        )}>
          <Icon className={cn(
            'w-5 h-5',
            variant === 'highlighted' ? 'text-primary' : 'text-muted-foreground'
          )} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground mb-1">{title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          {value && (
            <p className="mt-2 text-sm font-medium text-primary">
              Value: {value}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Comparison card for before/after
export function ComparisonCard({
  title,
  items,
  variant,
  className,
}: {
  title: string
  items: { label: string; value: string; isGood?: boolean }[]
  variant: 'before' | 'after'
  className?: string
}) {
  return (
    <div className={cn(
      'p-6 rounded-xl border',
      variant === 'before'
        ? 'bg-destructive/5 border-destructive/20'
        : 'bg-success/5 border-success/20',
      className
    )}>
      <h4 className={cn(
        'font-semibold mb-4 text-sm uppercase tracking-wider',
        variant === 'before' ? 'text-destructive' : 'text-success'
      )}>
        {title}
      </h4>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className={cn(
              'mt-0.5',
              item.isGood ? 'text-success' : 'text-muted-foreground'
            )}>
              {item.isGood ? '✓' : variant === 'before' ? '✗' : '→'}
            </span>
            <div>
              <span className="text-muted-foreground">{item.label}:</span>{' '}
              <span className={cn(
                'font-medium',
                item.isGood ? 'text-success' : 'text-foreground'
              )}>{item.value}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Tech stack card
export function TechStackCard({
  detected,
  missing,
  className,
}: {
  detected: { name: string; type: string }[]
  missing: { name: string; value: string }[]
  className?: string
}) {
  return (
    <div className={cn('grid md:grid-cols-2 gap-4', className)}>
      <div className="p-5 rounded-xl bg-success/5 border border-success/20">
        <h4 className="font-semibold text-success mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success" />
          Detected
        </h4>
        <ul className="space-y-2">
          {detected.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <span className="text-success">✓</span>
              <span className="text-muted-foreground">{item.type}:</span>
              <span className="text-foreground">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-5 rounded-xl bg-hot/5 border border-hot/20">
        <h4 className="font-semibold text-hot mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-hot" />
          Opportunity
        </h4>
        <ul className="space-y-2">
          {missing.map((item, i) => (
            <li key={i} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className="text-hot">✗</span>
                <span className="text-foreground">{item.name}</span>
              </span>
              <span className="text-success font-medium">{item.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
