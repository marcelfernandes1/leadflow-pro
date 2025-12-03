import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'group relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-violet to-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 before:transition-opacity hover:before:opacity-100',
        destructive:
          'bg-gradient-to-r from-rose to-destructive text-destructive-foreground shadow-lg shadow-destructive/25 hover:shadow-xl hover:shadow-destructive/30 hover:scale-[1.02] active:scale-[0.98]',
        outline:
          'border border-border bg-transparent hover:bg-white/5 hover:border-primary/50 hover:text-primary hover:shadow-lg hover:shadow-primary/10 active:scale-[0.98]',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-[1.02] active:scale-[0.98]',
        ghost:
          'hover:bg-white/5 hover:text-foreground active:scale-[0.98]',
        link:
          'text-primary underline-offset-4 hover:underline hover:text-primary/80',
        glow:
          'bg-gradient-to-r from-violet via-cyan to-emerald text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] animate-pulse-glow',
        glass:
          'glass text-foreground hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98]',
        success:
          'bg-gradient-to-r from-emerald to-success text-success-foreground shadow-lg shadow-success/25 hover:shadow-xl hover:shadow-success/30 hover:scale-[1.02] active:scale-[0.98]',
      },
      size: {
        default: 'h-11 px-5 py-2.5 rounded-lg',
        sm: 'h-9 px-4 rounded-md text-xs',
        lg: 'h-12 px-8 rounded-xl text-base',
        xl: 'h-14 px-10 rounded-xl text-lg',
        icon: 'h-10 w-10 rounded-lg',
        'icon-sm': 'h-8 w-8 rounded-md',
        'icon-lg': 'h-12 w-12 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
