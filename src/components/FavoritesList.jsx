import PoemCard from './PoemCard'

export default function FavoritesList({ favorites, isFavorite, onToggleFavorite, onOpenReader }) {
  if (favorites.length === 0) {
    return (
      <div className="empty">
        <p>No favorites yet.</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
          Press ♡ on any poem to save it here.
        </p>
      </div>
    )
  }

  return (
    <div className="poem-grid">
      {favorites.map((poem, i) => (
        <PoemCard
          key={`${poem.title}-${i}`}
          poem={poem}
          isFavorite={isFavorite(poem)}
          onToggleFavorite={onToggleFavorite}
          onOpenReader={onOpenReader}
        />
      ))}
    </div>
  )
}
