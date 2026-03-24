import { useState, useEffect, useCallback } from 'react'
import { useTypewriter } from '../hooks/useTypewriter'

const MAX_VISIBLE_LINES = 12

export default function FeaturedPoem({ onOpenReader }) {
  const [poem, setPoem] = useState(null)
  const [lineIndex, setLineIndex] = useState(0)

  const fetchFeatured = useCallback(async () => {
    try {
      const res = await fetch('https://poetrydb.org/random/1')
      const data = await res.json()
      if (Array.isArray(data) && data[0]) {
        setPoem(data[0])
        setLineIndex(0)
      }
    } catch { /* silent */ }
  }, [])

  useEffect(() => { fetchFeatured() }, [fetchFeatured])

  const isLong = (poem?.lines?.length ?? 0) > MAX_VISIBLE_LINES
  // Stop typewriter at cap for long poems
  const effectiveMax = isLong ? MAX_VISIBLE_LINES - 1 : (poem?.lines?.length ?? 1) - 1

  const currentLine = poem?.lines?.[lineIndex] ?? ''
  const { displayed, done } = useTypewriter(currentLine, 35)

  useEffect(() => {
    if (!done || !poem) return
    if (lineIndex >= effectiveMax) return
    const t = setTimeout(() => setLineIndex(i => i + 1), 600)
    return () => clearTimeout(t)
  }, [done, lineIndex, poem, effectiveMax])

  const visibleLines = poem?.lines?.slice(0, lineIndex) ?? []
  const cappedAtLimit = lineIndex >= effectiveMax && done

  return (
    <section className="featured" aria-label="Featured poem">
      <p className="featured-label">✦ &nbsp; Verse of the Moment &nbsp; ✦</p>
      {poem ? (
        <>
          <h2 className="featured-title">{poem.title}</h2>
          <p className="featured-author">{poem.author}</p>
          <div className={`featured-lines ${isLong && cappedAtLimit ? 'featured-lines--faded' : ''}`}>
            {visibleLines.map((line, i) => (
              <div key={i}>{line || '\u00A0'}</div>
            ))}
            <div>
              {displayed || '\u00A0'}
              {!done && <span className="typewriter-cursor" aria-hidden="true" />}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
            <button className="btn btn-ghost" style={{ fontSize: '0.8rem' }} onClick={fetchFeatured}>
              another verse
            </button>
            <button className="btn btn-ghost" style={{ fontSize: '0.8rem' }} onClick={() => onOpenReader(poem)}>
              {isLong ? 'read full poem' : 'read in full'}
            </button>
          </div>
        </>
      ) : (
        <div className="loading">
          <span className="loading-dots"><span>·</span><span>·</span><span>·</span></span>
        </div>
      )}
    </section>
  )
}
