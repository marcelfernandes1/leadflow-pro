import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default:
          'border-primary/30 bg-primary/10 text-primary',
        secondary:
          'border-border bg-secondary text-secondary-foreground',
        destructive:
          'border-destructive/30 bg-destructive/10 text-destructive',
        outline:
          'border-border text-muted-foreground',
        success:
          'border-success/30 bg-success/10 text-success',
        warning:
          'border-warning/30 bg-warning/10 text-warning',
        // Heat badges - MUST POP for lead scoring
        hot:
          'border-hot/30 bg-hot/10 text-hot font-semibold',
        warm:
          'border-warm/30 bg-warm/10 text-warm font-semibold',
        cold:
          'border-cold/30 bg-cold/10 text-cold font-semibold',
        // Special variants
        glow:
          'border-primary/40 bg-primary/15 text-primary shadow-sm shadow-primary/20',
        glass:
          'border-border/40 bg-white/5 text-foreground backdrop-blur-md',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
