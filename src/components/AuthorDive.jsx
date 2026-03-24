import { useState, useEffect } from 'react'
import PoemCard from './PoemCard'

export default function AuthorDive({ author, isFavorite, onToggleFavorite, onOpenReader, onClose }) {
  const [poems, setPoems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`https://poetrydb.org/author/${encodeURIComponent(author)}`)
      .then(r => r.json())
      .then(data => setPoems(Array.isArray(data) ? data : []))
      .catch(() => setPoems([]))
      .finally(() => setLoading(false))
  }, [author])

  return (
    <div className="author-dive">
      <div className="author-dive-header">
        <div>
          <p className="featured-label" style={{ textAlign: 'left', marginBottom: '0.25rem' }}>Author</p>
          <h2 className="author-dive-name">{author}</h2>
          {!loading && <p className="author-dive-count">{poems.length} poem{poems.length !== 1 ? 's' : ''} in collection</p>}
        </div>
        <button className="btn btn-ghost" onClick={onClose} style={{ flexShrink: 0 }}>← Back</button>
      </div>

      {loading ? (
        <div className="loading">
          <span className="loading-dots"><span>·</span><span>·</span><span>·</span></span>
        </div>
      ) : poems.length === 0 ? (
        <div className="empty">No poems found for this author.</div>
      ) : (
        <div className="poem-grid">
          {poems.map((poem, i) => (
            <PoemCard
              key={`${poem.title}-${i}`}
              poem={poem}
              isFavorite={isFavorite(poem)}
              onToggleFavorite={onToggleFavorite}
              onOpenReader={onOpenReader}
            />
          ))}
        </div>
      )}
    </div>
  )
}
