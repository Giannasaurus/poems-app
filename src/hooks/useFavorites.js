import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { fetchFavorites, addFavorite, removeFavorite } from '../lib/db'

const LOCAL_KEY = 'verses_favorites'

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY)) || [] } catch { return [] }
}

export function useFavorites() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState(loadLocal)

  // Sync from cloud when user logs in
  useEffect(() => {
    if (!user) {
      setFavorites(loadLocal())
      return
    }
    fetchFavorites(user.id).then(setFavorites)
  }, [user])

  const toggle = useCallback(async (poem) => {
    const exists = favorites.some(p => p.title === poem.title && p.author === poem.author)
    const next = exists
      ? favorites.filter(p => !(p.title === poem.title && p.author === poem.author))
      : [poem, ...favorites]
    setFavorites(next)
    if (user) {
      exists ? await removeFavorite(user.id, poem) : await addFavorite(user.id, poem)
    } else {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(next))
    }
  }, [favorites, user])

  const isFavorite = useCallback((poem) =>
    favorites.some(p => p.title === poem.title && p.author === poem.author),
  [favorites])

  return { favorites, toggle, isFavorite }
}
