import { useState, useEffect } from 'react'

const THEMES = {
  dark:    { '--ink': '#1a1a2e', '--parchment': '#f5f0e8', '--gold': '#c9a84c', '--gold-light': '#e8d5a3', '--rose': '#8b3a52' },
  midnight:{ '--ink': '#0d1117', '--parchment': '#cdd9e5', '--gold': '#79c0ff', '--gold-light': '#b3d4f5', '--rose': '#f47067' },
  sepia:   { '--ink': '#2c1f14', '--parchment': '#f0e6d3', '--gold': '#b8860b', '--gold-light': '#d4a843', '--rose': '#8b4513' },
}

export const THEME_NAMES = Object.keys(THEMES)
export const THEME_LABELS = { dark: 'Dark', midnight: 'Midnight', sepia: 'Sepia' }

export function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('verses_theme') || 'dark')

  useEffect(() => {
    const vars = THEMES[theme] || THEMES.dark
    const root = document.documentElement
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v))
    localStorage.setItem('verses_theme', theme)
  }, [theme])

  return { theme, setTheme, themes: THEME_NAMES }
}
