import { useEffect } from 'react'

export function useKeyboardShortcuts({ onRandom, onFocusSearch, readerOpen }) {
  useEffect(() => {
    const handler = (e) => {
      // Don't fire when typing in inputs/textareas
      const tag = e.target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return
      if (readerOpen) return // reader handles its own Escape

      switch (e.key) {
        case 'r': case 'R':
          e.preventDefault()
          onRandom?.()
          break
        case '/':
          e.preventDefault()
          onFocusSearch?.()
          break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onRandom, onFocusSearch, readerOpen])
}
