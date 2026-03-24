import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { fetchHistory, addHistory, clearHistory as clearHistoryDb } from '../lib/db'

const MAX = 30
const LOCAL_KEY = 'verses_history'

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY)) || [] } catch { return [] }
}

export function useReadingHistory() {
  const { user } = useAuth()
  const [history, setHistory] = useState(loadLocal)

  useEffect(() => {
    if (!user) { setHistory(loadLocal()); return }
    fetchHistory(user.id).then(setHistory)
  }, [user])

  const addToHistory = useCallback(async (poem) => {
    const filtered = history.filter(p => !(p.title === poem.title && p.author === poem.author))
    const next = [{ ...poem, readAt: new Date().toISOString() }, ...filtered].slice(0, MAX)
    setHistory(next)
    if (user) {
      await addHistory(user.id, poem)
    } else {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(next))
    }
  }, [history, user])

  const clearHistory = useCallback(async () => {
    setHistory([])
    if (user) {
      await clearHistoryDb(user.id)
    } else {
      localStorage.removeItem(LOCAL_KEY)
    }
  }, [user])

  return { history, addToHistory, clearHistory }
}
