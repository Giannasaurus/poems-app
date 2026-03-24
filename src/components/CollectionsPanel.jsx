import { useState } from 'react'
import PoemCard from './PoemCard'

export default function CollectionsPanel({ collections, collectionNames, onCreateCollection, onDeleteCollection, onRemoveFromCollection, isFavorite, onToggleFavorite, onOpenReader }) {
  const [activeCol, setActiveCol] = useState(null)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)

  const handleCreate = (e) => {
    e.preventDefault()
    const name = newName.trim()
    if (!name) return
    onCreateCollection(name)
    setNewName('')
    setCreating(false)
    setActiveCol(name)
  }

  if (activeCol && collections[activeCol]) {
    const poems = collections[activeCol]
    return (
      <div>
        <div className="collection-header">
          <div>
            <p className="featured-label" style={{ textAlign: 'left', marginBottom: '0.2rem' }}>Collection</p>
            <h2 className="author-dive-name">{activeCol}</h2>
            <p className="author-dive-count">{poems.length} poem{poems.length !== 1 ? 's' : ''}</p>
          </div>
          <button className="btn btn-ghost" onClick={() => setActiveCol(null)}>← Back</button>
        </div>
        {poems.length === 0 ? (
          <div className="empty">
            <p>This collection is empty.</p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Add poems from the Explore tab using the ⊕ button.</p>
          </div>
        ) : (
          <div className="poem-grid">
            {poems.map((poem, i) => (
              <div key={`${poem.title}-${i}`} style={{ position: 'relative' }}>
                <PoemCard
                  poem={poem}
                  isFavorite={isFavorite(poem)}
                  onToggleFavorite={onToggleFavorite}
                  onOpenReader={onOpenReader}
                />
                <button
                  className="remove-from-col-btn"
                  onClick={() => onRemoveFromCollection(activeCol, poem)}
                  title="Remove from collection"
                >✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="collections-top">
        <p style={{ color: 'rgba(245,240,232,0.35)', fontStyle: 'italic', fontSize: '0.9rem' }}>
          {collectionNames.length === 0 ? 'No collections yet.' : `${collectionNames.length} collection${collectionNames.length !== 1 ? 's' : ''}`}
        </p>
        <button className="btn btn-ghost" style={{ fontSize: '0.8rem' }} onClick={() => setCreating(c => !c)}>
          + New collection
        </button>
      </div>

      {creating && (
        <form className="new-collection-form" onSubmit={handleCreate}>
          <input
            className="search-input"
            placeholder="Collection name…"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            autoFocus
          />
          <button className="btn" type="submit">Create</button>
          <button className="btn btn-ghost" type="button" onClick={() => setCreating(false)}>Cancel</button>
        </form>
      )}

      {collectionNames.length === 0 && !creating ? (
        <div className="empty" style={{ paddingTop: '2rem' }}>
          <p>Create a collection to organise your poems.</p>
        </div>
      ) : (
        <div className="collections-grid">
          {collectionNames.map(name => (
            <div key={name} className="collection-card" onClick={() => setActiveCol(name)}>
              <div className="collection-card-body">
                <h3 className="collection-name">{name}</h3>
                <p className="collection-count">{collections[name].length} poem{collections[name].length !== 1 ? 's' : ''}</p>
              </div>
              <button
                className="collection-delete-btn"
                onClick={e => { e.stopPropagation(); onDeleteCollection(name) }}
                title="Delete collection"
                aria-label={`Delete collection ${name}`}
              >✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
