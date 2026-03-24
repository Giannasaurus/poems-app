import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { fetchStreak, upsertStreak } from '../lib/db'

const LOCAL_KEY = 'verses_streak'

function todayStr() { return new Date().toISOString().slice(0, 10) }
function yesterdayStr() {
  const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10)
}

function computeStreak(raw) {
  const today = todayStr()
  const yesterday = yesterdayStr()
  if (raw?.last_date === today) return { count: raw.count, last_date: today }
  if (raw?.last_date === yesterday) return { count: (raw.count || 0) + 1, last_date: today }
  return { count: 1, last_date: today }
}

export function useStreak() {
  const { user } = useAuth()
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    if (user) {
      fetchStreak(user.id).then(async (raw) => {
        const next = computeStreak(raw)
        setStreak(next.count)
        await upsertStreak(user.id, next.count, next.last_date)
      })
    } else {
      try {
        const raw = JSON.parse(localStorage.getItem(LOCAL_KEY)) || { count: 0, last_date: null }
        const next = computeStreak({ count: raw.count, last_date: raw.last })
        localStorage.setItem(LOCAL_KEY, JSON.stringify({ count: next.count, last: next.last_date }))
        setStreak(next.count)
      } catch { setStreak(1) }
    }
  }, [user])

  return streak
}
