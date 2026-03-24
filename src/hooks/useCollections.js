import { useState, useCallback } from 'react'

const KEY = 'verses_collections'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {} }
  catch { return {} }
}

function save(data) { localStorage.setItem(KEY, JSON.stringify(data)) }

const poemId = (p) => `${p.author}::${p.title}`

export function useCollections() {
  const [collections, setCollections] = useState(load)

  const createCollection = useCallback((name) => {
    setCollections(prev => {
      if (prev[name]) return prev
      const next = { ...prev, [name]: [] }
      save(next)
      return next
    })
  }, [])

  const deleteCollection = useCallback((name) => {
    setCollections(prev => {
      const next = { ...prev }
      delete next[name]
      save(next)
      return next
    })
  }, [])

  const addToCollection = useCallback((name, poem) => {
    setCollections(prev => {
      const list = prev[name] || []
      if (list.some(p => poemId(p) === poemId(poem))) return prev
      const next = { ...prev, [name]: [poem, ...list] }
      save(next)
      return next
    })
  }, [])

  const removeFromCollection = useCallback((name, poem) => {
    setCollections(prev => {
      const next = { ...prev, [name]: (prev[name] || []).filter(p => poemId(p) !== poemId(poem)) }
      save(next)
      return next
    })
  }, [])

  const isInCollection = useCallback((name, poem) => {
    return (collections[name] || []).some(p => poemId(p) === poemId(poem))
  }, [collections])

  const collectionNames = Object.keys(collections)

  return { collections, collectionNames, createCollection, deleteCollection, addToCollection, removeFromCollection, isInCollection }
}
