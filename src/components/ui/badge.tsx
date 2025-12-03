import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary/20 text-primary backdrop-blur-sm',
        secondary:
          'border-border/50 bg-secondary/50 text-secondary-foreground backdrop-blur-sm',
        destructive:
          'border-transparent bg-destructive/20 text-destructive backdrop-blur-sm',
        outline:
          'border-border/50 text-foreground bg-transparent',
        success:
          'border-transparent bg-success/20 text-success backdrop-blur-sm',
        warning:
          'border-transparent bg-warning/20 text-warning backdrop-blur-sm',
        hot:
          'border-transparent gradient-hot text-white shadow-lg shadow-rose/20 animate-pulse',
        warm:
          'border-transparent gradient-warm text-white shadow-lg shadow-amber/20',
        cold:
          'border-transparent gradient-cold text-white shadow-lg shadow-cyan/20',
        glass:
          'border-white/10 bg-white/5 text-foreground backdrop-blur-md',
        glow:
          'border-transparent bg-gradient-to-r from-violet to-cyan text-white shadow-lg shadow-violet/30',
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
