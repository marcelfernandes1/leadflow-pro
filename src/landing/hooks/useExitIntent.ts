import { useEffect, useState, useCallback } from 'react'

interface UseExitIntentOptions {
  threshold?: number
  delay?: number
  onlyOnce?: boolean
}

export function useExitIntent(options: UseExitIntentOptions = {}) {
  const { threshold = 20, delay = 2000, onlyOnce = true } = options
  const [showExitIntent, setShowExitIntent] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)

  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      if (onlyOnce && hasTriggered) return
      if (e.clientY <= threshold) {
        setShowExitIntent(true)
        setHasTriggered(true)
      }
    },
    [threshold, onlyOnce, hasTriggered]
  )

  useEffect(() => {
    const timeout = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave)
    }, delay)

    return () => {
      clearTimeout(timeout)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseLeave, delay])

  const closeExitIntent = useCallback(() => {
    setShowExitIntent(false)
  }, [])

  return { showExitIntent, closeExitIntent, hasTriggered }
}
