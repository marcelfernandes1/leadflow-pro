import { useEffect, useState, useRef } from 'react'
import { animate } from 'framer-motion'

interface CountUpScoreProps {
  value: number
  duration?: number
  delay?: number
  className?: string
}

export function CountUpScore({
  value,
  duration = 0.8,
  delay = 0,
  className,
}: CountUpScoreProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const prevValue = useRef(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const controls = animate(prevValue.current, value, {
        duration,
        ease: [0.4, 0, 0.2, 1],
        onUpdate: (latest) => {
          setDisplayValue(Math.round(latest))
        },
        onComplete: () => {
          prevValue.current = value
        },
      })

      return () => controls.stop()
    }, delay * 1000)

    return () => clearTimeout(timeout)
  }, [value, duration, delay])

  return <span className={className}>{displayValue}</span>
}
