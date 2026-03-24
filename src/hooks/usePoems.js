import { useState, useCallback } from 'react'

const BASE = 'https://poetrydb.org'

export function usePoems() {
  const [poems, setPoems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchPoems = useCallback(async (query = '', searchBy = 'title') => {
    setLoading(true)
    setError(null)
    try {
      const endpoint = query.trim()
        ? `${BASE}/${searchBy}/${encodeURIComponent(query.trim())}`
        : `${BASE}/random/12`
      const res = await fetch(endpoint)
      if (!res.ok) throw new Error('Failed to fetch poems')
      const data = await res.json()
      if (data.status === 404 || !Array.isArray(data)) {
        setPoems([])
      } else {
        setPoems(data.slice(0, 20))
      }
    } catch (err) {
      setError(err.message)
      setPoems([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchRandom = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${BASE}/random/1`)
      if (!res.ok) throw new Error('Failed to fetch poem')
      const data = await res.json()
      return Array.isArray(data) ? data[0] : null
    } catch {
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { poems, loading, error, fetchPoems, fetchRandom }
}
