import { useState, useEffect } from 'react'
import { useTypewriter } from '../hooks/useTypewriter'

// Deterministic daily seed — same poem all day
function getDaySeed() {
  const d = new Date()
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
}

export default function PoemOfDay({ onOpenReader }) {
  const [poem, setPoem] = useState(null)
  const [lineIndex, setLineIndex] = useState(0)

  useEffect(() => {
    const cached = localStorage.getItem('verses_pod')
    if (cached) {
      try {
        const { seed, data } = JSON.parse(cached)
        if (seed === getDaySeed()) { setPoem(data); return }
      } catch { /* refetch */ }
    }

    fetch('https://poetrydb.org/random/20')
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data)) return
        const seed = getDaySeed()
        const pick = data[seed % data.length]
        localStorage.setItem('verses_pod', JSON.stringify({ seed, data: pick }))
        setPoem(pick)
      })
      .catch(() => {})
  }, [])

  const currentLine = poem?.lines?.[lineIndex] ?? ''
  const { displayed, done } = useTypewriter(currentLine, 30)

  useEffect(() => {
    if (!done || !poem) return
    if (lineIndex >= poem.lines.length - 1) return
    const t = setTimeout(() => setLineIndex(i => i + 1), 500)
    return () => clearTimeout(t)
  }, [done, lineIndex, poem])

  const visibleLines = poem?.lines?.slice(0, lineIndex) ?? []

  return (
    <section className="pod-section" aria-label="Poem of the day">
      <p className="featured-label">✦ &nbsp; Poem of the Day &nbsp; ✦</p>
      {poem ? (
        <>
          <h2 className="featured-title">{poem.title}</h2>
          <p className="featured-author">{poem.author}</p>
          <div className="featured-lines pod-lines">
            {visibleLines.map((line, i) => <div key={i}>{line || '\u00A0'}</div>)}
            <div>
              {displayed || '\u00A0'}
              {!done && <span className="typewriter-cursor" aria-hidden="true" />}
            </div>
          </div>
          <button className="btn btn-ghost" style={{ marginTop: '1.5rem', fontSize: '0.8rem' }} onClick={() => onOpenReader(poem)}>
            read in full
          </button>
        </>
      ) : (
        <div className="loading">
          <span className="loading-dots"><span>·</span><span>·</span><span>·</span></span>
        </div>
      )}
    </section>
  )
}
