import { useState, useRef } from 'react'
import { useVersion } from '../context/VersionContext'
import { getFlags } from '../versions'

export default function PoemCard({ poem, isFavorite, onToggleFavorite, onOpenReader, onAuthorClick, onAddToCollection, collectionNames = [] }) {
  const { version } = useVersion()
  const flags = getFlags(version)
  const [expanded, setExpanded] = useState(false)
  const [showColMenu, setShowColMenu] = useState(false)
  const cardRef = useRef(null)

  const lines = poem.lines?.join('\n') || ''
  const preview = poem.lines?.slice(0, 4).join('\n') || ''
  const wordCount = poem.lines?.join(' ').split(/\s+/).filter(Boolean).length || 0
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  const handleCardClick = () => {
    if (expanded && flags.collapseScroll) {
      setExpanded(false)
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    } else if (expanded) {
      setExpanded(false)
    } else {
      setExpanded(true)
    }
  }

  const handleCopy = async (e) => {
    e.stopPropagation()
    try { await navigator.clipboard.writeText(`${poem.title}\nby ${poem.author}\n\n${lines}`) }
    catch { /* silent */ }
  }

  return (
    <article
      ref={cardRef}
      className={`poem-card ${expanded ? 'expanded' : ''}`}
      onClick={handleCardClick}
      aria-label={`Poem: ${poem.title} by ${poem.author}`}
      aria-expanded={expanded}
    >
      <div className="poem-card-header">
        <div>
          <h2 className="poem-title">{poem.title}</h2>
          <p className="poem-author">
            {flags.authorDive && onAuthorClick ? (
              <button
                className="author-link"
                onClick={e => { e.stopPropagation(); onAuthorClick(poem.author) }}
                title={`Browse all poems by ${poem.author}`}
              >
                {poem.author}
              </button>
            ) : poem.author}
          </p>
        </div>
        <div className="poem-card-actions">
          {flags.collections && collectionNames.length > 0 && (
            <div style={{ position: 'relative' }}>
              <button
                className="icon-btn"
                onClick={e => { e.stopPropagation(); setShowColMenu(m => !m) }}
                title="Add to collection"
                aria-label="Add to collection"
              >⊕</button>
              {showColMenu && (
                <div className="col-menu" onClick={e => e.stopPropagation()}>
                  {collectionNames.map(name => (
                    <button key={name} className="col-menu-item" onClick={() => { onAddToCollection(name, poem); setShowColMenu(false) }}>
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <button
            className="fav-btn"
            onClick={e => { e.stopPropagation(); onToggleFavorite(poem) }}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? '♥' : '♡'}
          </button>
        </div>
      </div>

      {expanded ? (
        <pre className="poem-lines">{lines}</pre>
      ) : (
        <pre className="poem-lines-preview">{preview}</pre>
      )}

      <div className="poem-footer">
        <div className="poem-meta">
          <span className="poem-line-count">{poem.linecount} lines</span>
          {flags.readingTime && (
            <span className="poem-reading-time">· {readingTime} min read</span>
          )}
        </div>
        <div className="poem-footer-actions">
          {expanded && flags.readingMode && (
            <button
              className="icon-btn"
              onClick={e => { e.stopPropagation(); onOpenReader(poem) }}
              title="Immersive reading mode"
              aria-label="Open immersive reading mode"
            >⛶</button>
          )}
          {expanded && flags.copyBtn && (
            <button className="icon-btn" onClick={handleCopy} title="Copy poem" aria-label="Copy poem">
              ⎘
            </button>
          )}
          <span className="click-hint">{expanded ? 'click to collapse' : 'click to read'}</span>
        </div>
      </div>
    </article>
  )
}
