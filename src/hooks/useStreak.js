import { useState, useEffect } from 'react'

const KEY = 'verses_streak'

function todayStr() {
  return new Date().toISOString().slice(0, 10) // YYYY-MM-DD
}

function yesterdayStr() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

export function useStreak() {
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY)) || { count: 0, last: null }
      const today = todayStr()
      const yesterday = yesterdayStr()

      let next
      if (raw.last === today) {
        // Already visited today, keep streak
        next = { count: raw.count, last: today }
      } else if (raw.last === yesterday) {
        // Consecutive day
        next = { count: raw.count + 1, last: today }
      } else {
        // Streak broken or first visit
        next = { count: 1, last: today }
      }

      localStorage.setItem(KEY, JSON.stringify(next))
      setStreak(next.count)
    } catch {
      setStreak(1)
    }
  }, [])

  return streak
}
