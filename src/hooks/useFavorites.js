import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'verses_favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  const toggle = useCallback((poem) => {
    setFavorites(prev => {
      const exists = prev.some(p => p.title === poem.title && p.author === poem.author)
      return exists
        ? prev.filter(p => !(p.title === poem.title && p.author === poem.author))
        : [poem, ...prev]
    })
  }, [])

  const isFavorite = useCallback((poem) =>
    favorites.some(p => p.title === poem.title && p.author === poem.author),
  [favorites])

  return { favorites, toggle, isFavorite }
}
