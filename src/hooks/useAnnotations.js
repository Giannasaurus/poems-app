import { useState, useCallback } from 'react'

const KEY = 'verses_annotations'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {} }
  catch { return {} }
}

function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

// annotations shape: { [poemKey]: { [lineIndex]: noteText } }
const poemKey = (poem) => `${poem.author}::${poem.title}`

export function useAnnotations() {
  const [annotations, setAnnotations] = useState(load)

  const getNote = useCallback((poem, lineIndex) => {
    return annotations[poemKey(poem)]?.[lineIndex] ?? ''
  }, [annotations])

  const setNote = useCallback((poem, lineIndex, text) => {
    setAnnotations(prev => {
      const key = poemKey(poem)
      const next = {
        ...prev,
        [key]: { ...(prev[key] || {}), [lineIndex]: text }
      }
      if (!text.trim()) delete next[key][lineIndex]
      if (Object.keys(next[key] || {}).length === 0) delete next[key]
      save(next)
      return next
    })
  }, [])

  const getPoemNotes = useCallback((poem) => {
    return annotations[poemKey(poem)] || {}
  }, [annotations])

  return { getNote, setNote, getPoemNotes }
}
