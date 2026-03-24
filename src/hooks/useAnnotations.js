import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { fetchAnnotations, upsertAnnotation } from '../lib/db'

const LOCAL_KEY = 'verses_annotations'

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY)) || {} } catch { return {} }
}
function saveLocal(data) { localStorage.setItem(LOCAL_KEY, JSON.stringify(data)) }

const poemKey = (poem) => `${poem.author}::${poem.title}`

export function useAnnotations() {
  const { user } = useAuth()
  const [annotations, setAnnotations] = useState(loadLocal)

  useEffect(() => {
    if (!user) { setAnnotations(loadLocal()); return }
    fetchAnnotations(user.id).then(setAnnotations)
  }, [user])

  const getNote = useCallback((poem, lineIndex) =>
    annotations[poemKey(poem)]?.[lineIndex] ?? '',
  [annotations])

  const setNote = useCallback(async (poem, lineIndex, text) => {
    const key = poemKey(poem)
    setAnnotations(prev => {
      const next = { ...prev, [key]: { ...(prev[key] || {}), [lineIndex]: text } }
      if (!text.trim()) delete next[key][lineIndex]
      if (Object.keys(next[key] || {}).length === 0) delete next[key]
      if (!user) saveLocal(next)
      return next
    })
    if (user) await upsertAnnotation(user.id, key, lineIndex, text)
  }, [user])

  const getPoemNotes = useCallback((poem) =>
    annotations[poemKey(poem)] || {},
  [annotations])

  return { getNote, setNote, getPoemNotes }
}
