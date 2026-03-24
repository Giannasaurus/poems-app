import { useState, useEffect, useRef } from 'react'

export function useTypewriter(text = '', speed = 28) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const indexRef = useRef(0)
  const timerRef = useRef(null)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    indexRef.current = 0
    clearInterval(timerRef.current)

    if (!text) return

    timerRef.current = setInterval(() => {
      indexRef.current += 1
      setDisplayed(text.slice(0, indexRef.current))
      if (indexRef.current >= text.length) {
        clearInterval(timerRef.current)
        setDone(true)
      }
    }, speed)

    return () => clearInterval(timerRef.current)
  }, [text, speed])

  return { displayed, done }
}
