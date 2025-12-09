import { useEffect, useState, useCallback } from 'react'

interface ActivityItem {
  id: string
  name: string
  action: string
  location: string
  timestamp: Date
  value?: string
}

const firstNames = [
  'Sarah', 'Marcus', 'Jennifer', 'David', 'Rachel', 'Michael', 'Emily', 'James',
  'Amanda', 'Christopher', 'Jessica', 'Andrew', 'Ashley', 'Daniel', 'Nicole',
  'Matthew', 'Stephanie', 'Joshua', 'Lauren', 'Brandon', 'Melissa', 'Ryan',
  'Elizabeth', 'Justin', 'Heather', 'Kevin', 'Michelle', 'Tyler', 'Kimberly',
  'Alex', 'Samantha', 'Carlos', 'Maria', 'Luis', 'Ana', 'Pedro', 'Sofia'
]

const lastInitials = ['K', 'W', 'O', 'P', 'R', 'T', 'M', 'L', 'S', 'C', 'B', 'H', 'D', 'J', 'G']

const cities = [
  'Austin', 'Miami', 'Denver', 'Portland', 'Seattle', 'Chicago', 'Boston',
  'San Diego', 'Phoenix', 'Atlanta', 'Dallas', 'Nashville', 'Charlotte',
  'Tampa', 'Las Vegas', 'Minneapolis', 'San Francisco', 'Los Angeles',
  'New York', 'Philadelphia', 'Houston', 'Orlando', 'Salt Lake City'
]

const actions = [
  { action: 'just signed up', weight: 40 },
  { action: 'upgraded to Pro', weight: 15 },
  { action: 'closed a deal using LeadFlow Pro', weight: 25, includeValue: true },
  { action: 'just upgraded to Agency tier', weight: 10 },
  { action: 'scored their first hot lead', weight: 10 },
]

const dealValues = ['$3,500', '$4,200', '$5,500', '$6,800', '$8,000', '$12,000', '$15,000', '$24,000']

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateActivity(): ActivityItem {
  const firstName = getRandomItem(firstNames)
  const lastInitial = getRandomItem(lastInitials)
  const city = getRandomItem(cities)

  // Weighted random selection
  const totalWeight = actions.reduce((sum, a) => sum + a.weight, 0)
  let random = Math.random() * totalWeight
  let selectedAction = actions[0]

  for (const action of actions) {
    random -= action.weight
    if (random <= 0) {
      selectedAction = action
      break
    }
  }

  return {
    id: Math.random().toString(36).substring(7),
    name: `${firstName} ${lastInitial}.`,
    action: selectedAction.action,
    location: city,
    timestamp: new Date(),
    value: selectedAction.includeValue ? getRandomItem(dealValues) : undefined,
  }
}

export function useLiveActivity(intervalMs: number = 15000, maxItems: number = 5) {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [currentActivity, setCurrentActivity] = useState<ActivityItem | null>(null)

  const addActivity = useCallback(() => {
    const newActivity = generateActivity()
    setCurrentActivity(newActivity)
    setActivities(prev => [newActivity, ...prev].slice(0, maxItems))

    // Clear current activity after display duration
    setTimeout(() => {
      setCurrentActivity(null)
    }, 5000)
  }, [maxItems])

  useEffect(() => {
    // Initial activity after short delay
    const initialTimeout = setTimeout(() => {
      addActivity()
    }, 3000)

    // Regular interval
    const interval = setInterval(addActivity, intervalMs)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [addActivity, intervalMs])

  return { activities, currentActivity }
}
