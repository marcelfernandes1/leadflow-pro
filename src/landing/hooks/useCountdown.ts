import { useEffect, useState, useCallback } from 'react'

interface CountdownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}

export function useCountdown(endTime: Date | number): CountdownTime {
  const calculateTimeLeft = useCallback(() => {
    const now = new Date().getTime()
    const end = typeof endTime === 'number' ? endTime : endTime.getTime()
    const difference = end - now

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
      isExpired: false,
    }
  }, [endTime])

  const [timeLeft, setTimeLeft] = useState<CountdownTime>(calculateTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [calculateTimeLeft])

  return timeLeft
}

// For page session countdown (e.g., "this page expires in X minutes")
export function useSessionCountdown(minutes: number) {
  const [endTime] = useState(() => Date.now() + minutes * 60 * 1000)
  return useCountdown(endTime)
}
