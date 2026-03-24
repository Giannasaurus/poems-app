import { useState, useCallback } from 'react'

const MAX = 30
const KEY = 'verses_history'

export function useReadingHistory() {
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || [] }
    catch { return [] }
  })

  const addToHistory = useCallback((poem) => {
    setHistory(prev => {
      const filtered = prev.filter(p => !(p.title === poem.title && p.author === poem.author))
      const next = [{ ...poem, readAt: new Date().toISOString() }, ...filtered].slice(0, MAX)
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const clearHistory = useCallback(() => {
    localStorage.removeItem(KEY)
    setHistory([])
  }, [])

  return { history, addToHistory, clearHistory }
}
