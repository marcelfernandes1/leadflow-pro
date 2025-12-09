import { useEffect, useRef, useState } from 'react'
import { useMotionValue, animate } from 'framer-motion'

interface UseCountUpOptions {
  duration?: number
  delay?: number
  startOnMount?: boolean
}

export function useCountUp(
  targetValue: number,
  options: UseCountUpOptions = {}
) {
  const { duration = 1, delay = 0, startOnMount = true } = options
  const [displayValue, setDisplayValue] = useState(0)
  const motionValue = useMotionValue(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!startOnMount || hasAnimated.current) return

    hasAnimated.current = true

    const timeout = setTimeout(() => {
      const controls = animate(motionValue, targetValue, {
        duration,
        ease: [0.4, 0, 0.2, 1],
        onUpdate: (latest) => {
          setDisplayValue(Math.round(latest))
        },
      })

      return () => controls.stop()
    }, delay * 1000)

    return () => clearTimeout(timeout)
  }, [targetValue, duration, delay, startOnMount, motionValue])

  // Update when target changes
  useEffect(() => {
    if (!hasAnimated.current) return

    animate(motionValue, targetValue, {
      duration: duration * 0.5,
      ease: [0.4, 0, 0.2, 1],
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest))
      },
    })
  }, [targetValue, duration, motionValue])

  return displayValue
}
