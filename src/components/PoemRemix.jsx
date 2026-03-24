import { useState } from 'react'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function PoemRemix({ poem, onSaveToCollection, collectionNames, onCreateAndSave }) {
  const [remixLines, setRemixLines] = useState(null)
  const [saved, setSaved] = useState(false)
  const [targetCol, setTargetCol] = useState('')

  const handleRemix = () => {
    const nonBlank = (poem.lines || []).filter(l => l.trim())
    setRemixLines(shuffle(nonBlank))
    setSaved(false)
  }

  const handleSave = () => {
    if (!remixLines || !targetCol) return
    const remixed = {
      ...poem,
      title: `${poem.title} (Remix)`,
      lines: remixLines,
      linecount: remixLines.length,
    }
    onSaveToCollection(targetCol, remixed)
    setSaved(true)
  }

  return (
    <div className="poem-remix">
      <p className="writing-prompt-label">⟳ &nbsp; Remix</p>
      <p className="remix-hint">Shuffle the lines into a new arrangement.</p>

      <button className="btn btn-ghost" style={{ fontSize: '0.85rem', marginBottom: '1rem' }} onClick={handleRemix}>
        {remixLines ? 'Reshuffle' : 'Remix this poem'}
      </button>

      {remixLines && (
        <>
          <pre className="remix-preview">{remixLines.join('\n')}</pre>
          {collectionNames.length > 0 && (
            <div className="remix-save-row">
              <select
                className="search-select"
                value={targetCol}
                onChange={e => setTargetCol(e.target.value)}
                aria-label="Save remix to collection"
              >
                <option value="">Save to collection…</option>
                {collectionNames.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <button
                className="btn"
                style={{ fontSize: '0.85rem' }}
                onClick={handleSave}
                disabled={!targetCol}
              >
                {saved ? 'Saved ✓' : 'Save remix'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
