import { useState } from 'react'
import PoemCard from './PoemCard'

export default function CompareMode({ poems, isFavorite, onToggleFavorite, onOpenReader, onClose }) {
  const [pinA, setPinA] = useState(null)
  const [pinB, setPinB] = useState(null)
  const [search, setSearch] = useState('')

  const filtered = poems.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.author.toLowerCase().includes(search.toLowerCase())
  )

  const pin = (poem) => {
    if (!pinA) { setPinA(poem); return }
    if (!pinB && poem.title !== pinA.title) { setPinB(poem); return }
  }

  const wordCount = (p) => p.lines?.join(' ').split(/\s+/).filter(Boolean).length || 0

  return (
    <div className="compare-mode">
      <div className="compare-header">
        <h2 className="author-dive-name" style={{ fontSize: '1.4rem' }}>Compare Poems</h2>
        <button className="btn btn-ghost" onClick={onClose}>← Back</button>
      </div>

      {(!pinA || !pinB) && (
        <div className="compare-picker">
          <p className="compare-hint">
            {!pinA ? 'Select the first poem to compare.' : 'Now select the second poem.'}
          </p>
          <input
            className="search-input"
            placeholder="Filter poems…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ marginBottom: '1rem' }}
          />
          <div className="poem-grid">
            {filtered.slice(0, 10).map((poem, i) => (
              <div
                key={`${poem.title}-${i}`}
                className={`compare-pick-card ${pinA?.title === poem.title ? 'pinned' : ''}`}
                onClick={() => pin(poem)}
              >
                <p className="poem-title" style={{ fontSize: '1.1rem' }}>{poem.title}</p>
                <p className="poem-author">{poem.author}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {pinA && pinB && (
        <>
          <div className="compare-stats-row">
            {[pinA, pinB].map((p, i) => (
              <div key={i} className="compare-stat-card">
                <p className="compare-stat-title">{p.title}</p>
                <p className="compare-stat-author">{p.author}</p>
                <div className="compare-stat-grid">
                  <span>{p.linecount} lines</span>
                  <span>{wordCount(p)} words</span>
                  <span>~{Math.max(1, Math.ceil(wordCount(p) / 200))} min read</span>
                </div>
              </div>
            ))}
          </div>

          <div className="compare-grid">
            {[pinA, pinB].map((p, i) => (
              <div key={i} className="compare-col">
                <PoemCard
                  poem={p}
                  isFavorite={isFavorite(p)}
                  onToggleFavorite={onToggleFavorite}
                  onOpenReader={onOpenReader}
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <button className="btn btn-ghost" onClick={() => { setPinA(null); setPinB(null) }}>
              Compare different poems
            </button>
          </div>
        </>
      )}
    </div>
  )
}
