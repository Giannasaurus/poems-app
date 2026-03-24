import PoemCard from './PoemCard'

export default function HistoryList({ history, isFavorite, onToggleFavorite, onOpenReader, onClear }) {
  if (history.length === 0) {
    return (
      <div className="empty">
        <p>No reading history yet.</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
          Poems you open will appear here.
        </p>
      </div>
    )
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button className="btn btn-ghost" onClick={onClear} style={{ fontSize: '0.8rem' }}>
          Clear history
        </button>
      </div>
      <div className="poem-grid">
        {history.map((poem, i) => (
          <div key={`${poem.title}-${i}`}>
            {poem.readAt && (
              <p className="history-timestamp">
                {new Date(poem.readAt).toLocaleDateString(undefined, {
                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </p>
            )}
            <PoemCard
              poem={poem}
              isFavorite={isFavorite(poem)}
              onToggleFavorite={onToggleFavorite}
              onOpenReader={onOpenReader}
            />
          </div>
        ))}
      </div>
    </>
  )
}
