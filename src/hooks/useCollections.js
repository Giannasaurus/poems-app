import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  fetchCollections,
  addToCollection as addToCollectionDb,
  removeFromCollection as removeFromCollectionDb,
  deleteCollection as deleteCollectionDb,
} from '../lib/db'

const LOCAL_KEY = 'verses_collections'

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY)) || {} } catch { return {} }
}
function saveLocal(data) { localStorage.setItem(LOCAL_KEY, JSON.stringify(data)) }

const poemId = (p) => `${p.author}::${p.title}`

export function useCollections() {
  const { user } = useAuth()
  const [collections, setCollections] = useState(loadLocal)

  useEffect(() => {
    if (!user) { setCollections(loadLocal()); return }
    fetchCollections(user.id).then(setCollections)
  }, [user])

  const createCollection = useCallback((name) => {
    setCollections(prev => {
      if (prev[name]) return prev
      const next = { ...prev, [name]: [] }
      if (!user) saveLocal(next)
      return next
    })
  }, [user])

  const deleteCollection = useCallback(async (name) => {
    setCollections(prev => {
      const next = { ...prev }
      delete next[name]
      if (!user) saveLocal(next)
      return next
    })
    if (user) await deleteCollectionDb(user.id, name)
  }, [user])

  const addToCollection = useCallback(async (name, poem) => {
    setCollections(prev => {
      const list = prev[name] || []
      if (list.some(p => poemId(p) === poemId(poem))) return prev
      const next = { ...prev, [name]: [poem, ...list] }
      if (!user) saveLocal(next)
      return next
    })
    if (user) await addToCollectionDb(user.id, name, poem)
  }, [user])

  const removeFromCollection = useCallback(async (name, poem) => {
    setCollections(prev => {
      const next = { ...prev, [name]: (prev[name] || []).filter(p => poemId(p) !== poemId(poem)) }
      if (!user) saveLocal(next)
      return next
    })
    if (user) await removeFromCollectionDb(user.id, name, poem)
  }, [user])

  const isInCollection = useCallback((name, poem) =>
    (collections[name] || []).some(p => poemId(p) === poemId(poem)),
  [collections])

  const collectionNames = Object.keys(collections)

  return { collections, collectionNames, createCollection, deleteCollection, addToCollection, removeFromCollection, isInCollection }
}
