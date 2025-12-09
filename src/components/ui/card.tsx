import * as React from 'react'
import { cn } from '@/lib/utils'

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'surface' | 'elevated' | 'interactive' | 'glass'
    hover?: boolean
  }
>(({ className, variant = 'default', hover = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl text-card-foreground',
      {
        // Default - glass card with backdrop blur
        'bg-card/70 backdrop-blur-xl border border-border/50 shadow-md': variant === 'default',
        // Surface - subtle glass
        'bg-surface/50 backdrop-blur-lg border border-border/30': variant === 'surface',
        // Elevated - more prominent glass
        'bg-card/80 backdrop-blur-xl border border-border/60 shadow-lg': variant === 'elevated',
        // Glass - frosted glass effect
        'bg-card/60 backdrop-blur-2xl border border-border/40 shadow-md shadow-black/20': variant === 'glass',
        // Interactive - for clickable cards
        'bg-card/70 backdrop-blur-xl border border-border/50 shadow-md transition-all duration-200 cursor-pointer hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 hover:bg-card/80 active:translate-y-0': variant === 'interactive',
        // Hover effects for non-interactive cards
        'transition-all duration-200 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5': hover && variant !== 'interactive',
      },
      className
    )}
    {...props}
  />
))
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
