import { motion } from 'framer-motion'
import { Link } from 'wouter'
import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
    icon?: LucideIcon
  }
  secondaryAction?: {
    label: string
    href?: string
    onClick?: () => void
  }
  className?: string
  iconClassName?: string
  variant?: 'default' | 'centered' | 'inline'
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  iconClassName,
  variant = 'default',
}: EmptyStateProps) {
  const content = (
    <>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'rounded-full p-4 mb-4',
          'bg-gradient-to-br from-primary/10 to-primary/5',
          iconClassName
        )}
      >
        <Icon className="h-8 w-8 text-primary" />
      </motion.div>

      <motion.h3
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="text-lg font-semibold mb-2"
      >
        {title}
      </motion.h3>

      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="text-muted-foreground text-center mb-6 max-w-sm"
      >
        {description}
      </motion.p>

      {(action || secondaryAction) && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          {action && (
            action.href ? (
              <Link href={action.href}>
                <Button className="gap-2">
                  {action.icon && <action.icon className="h-4 w-4" />}
                  {action.label}
                </Button>
              </Link>
            ) : (
              <Button onClick={action.onClick} className="gap-2">
                {action.icon && <action.icon className="h-4 w-4" />}
                {action.label}
              </Button>
            )
          )}
          {secondaryAction && (
            secondaryAction.href ? (
              <Link href={secondaryAction.href}>
                <Button variant="outline">{secondaryAction.label}</Button>
              </Link>
            ) : (
              <Button variant="outline" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            )
          )}
        </motion.div>
      )}
    </>
  )

  if (variant === 'inline') {
    return (
      <div className={cn('flex flex-col items-center justify-center py-8', className)}>
        {content}
      </div>
    )
  }

  return (
    <Card className={cn('border-dashed', className)}>
      <CardContent className="flex flex-col items-center justify-center py-12">
        {content}
      </CardContent>
    </Card>
  )
}

