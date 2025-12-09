import { useEffect, useState, useCallback } from 'react'

interface ScrollPosition {
  scrollY: number
  scrollX: number
  scrollDirection: 'up' | 'down' | null
  scrollPercent: number
}

export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    scrollY: 0,
    scrollX: 0,
    scrollDirection: null,
    scrollPercent: 0,
  })
  const [lastScrollY, setLastScrollY] = useState(0)

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY
    const currentScrollX = window.scrollX
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollPercent = documentHeight > 0 ? (currentScrollY / documentHeight) * 100 : 0

    setScrollPosition({
      scrollY: currentScrollY,
      scrollX: currentScrollX,
      scrollDirection: currentScrollY > lastScrollY ? 'down' : currentScrollY < lastScrollY ? 'up' : null,
      scrollPercent,
    })
    setLastScrollY(currentScrollY)
  }, [lastScrollY])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return scrollPosition
}

export function useScrollTrigger(threshold: number) {
  const { scrollPercent } = useScrollPosition()
  const [hasTriggered, setHasTriggered] = useState(false)

  useEffect(() => {
    if (scrollPercent >= threshold && !hasTriggered) {
      setHasTriggered(true)
    }
  }, [scrollPercent, threshold, hasTriggered])

  return { triggered: hasTriggered, scrollPercent }
}
