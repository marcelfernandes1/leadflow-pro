import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, WifiOff, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  title?: string
  message?: string
  error?: Error | null
  onRetry?: () => void
  className?: string
  variant?: 'default' | 'offline' | 'compact'
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  error,
  onRetry,
  className,
  variant = 'default',
}: ErrorStateProps) {
  const [showDetails, setShowDetails] = useState(false)

  const isOffline = variant === 'offline' || !navigator.onLine

  const Icon = isOffline ? WifiOff : AlertCircle
  const displayTitle = isOffline ? 'No internet connection' : title
  const displayMessage = isOffline
    ? 'Please check your network connection and try again.'
    : message

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'flex items-center gap-3 p-4 rounded-lg bg-destructive/10 text-destructive',
          className
        )}
      >
        <AlertCircle className="h-5 w-5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{displayMessage}</p>
        </div>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="shrink-0"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry
          </Button>
        )}
      </div>
    )
  }

  return (
    <Card className={cn('border-dashed', className)}>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            'rounded-full p-4 mb-4',
            isOffline ? 'bg-muted' : 'bg-destructive/10'
          )}
        >
          <Icon
            className={cn(
              'h-8 w-8',
              isOffline ? 'text-muted-foreground' : 'text-destructive'
            )}
          />
        </motion.div>

        <motion.h3
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-lg font-semibold mb-2"
        >
          {displayTitle}
        </motion.h3>

        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-center mb-4 max-w-sm"
        >
          {displayMessage}
        </motion.p>

        {onRetry && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button onClick={onRetry} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </motion.div>
        )}

        {/* Error Details (collapsible for debugging) */}
        {error && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 w-full max-w-md"
          >
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between text-muted-foreground"
              onClick={() => setShowDetails(!showDetails)}
            >
              <span className="text-xs">Technical Details</span>
              {showDetails ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>

            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 p-3 bg-muted rounded-lg text-xs font-mono text-muted-foreground overflow-auto max-h-32">
                    <p className="font-semibold text-foreground mb-1">
                      {error.name}: {error.message}
                    </p>
                    {error.stack && (
                      <pre className="whitespace-pre-wrap break-all">
                        {error.stack}
                      </pre>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}

// Hook to detect online/offline status
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useState(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  })

  return isOnline
}

// Inline error banner for forms/sections
export function ErrorBanner({
  message,
  onDismiss,
  className,
}: {
  message: string
  onDismiss?: () => void
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm',
        className
      )}
    >
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={onDismiss}
        >
          Dismiss
        </Button>
      )}
    </motion.div>
  )
}
