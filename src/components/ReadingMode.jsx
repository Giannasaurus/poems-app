import { useEffect, useRef, useState } from 'react'
import { useVersion } from '../context/VersionContext'
import { getFlags } from '../versions'
import PoemStats from './PoemStats'
import AmbientPlayer from './AmbientPlayer'
import { useAnnotations } from '../hooks/useAnnotations'
import WritingPrompt from './WritingPrompt'
import PoemRemix from './PoemRemix'

const FONT_SIZES = [
  { label: 'S', value: '0.95rem' },
  { label: 'M', value: '1.15rem' },
  { label: 'L', value: '1.4rem' },
  { label: 'XL', value: '1.7rem' },
]

export default function ReadingMode({ poem, onClose, collectionNames, onAddToCollection }) {
  const { version } = useVersion()
  const flags = getFlags(version)
  const overlayRef = useRef(null)
  const [fontSize, setFontSize] = useState('1.15rem')
  const [copied, setCopied] = useState(false)
  const [activePanel, setActivePanel] = useState(null) // 'stats' | 'notes'
  const [annotatingLine, setAnnotatingLine] = useState(null)
  const [draftNote, setDraftNote] = useState('')
  const { getNote, setNote, getPoemNotes } = useAnnotations()

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', handler); document.body.style.overflow = '' }
  }, [onClose])

  const handleCopy = async () => {
    const text = `${poem.title}\nby ${poem.author}\n\n${poem.lines?.join('\n')}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* silent */ }
  }

  const handleShareImage = () => {
    const canvas = document.createElement('canvas')
    const W = 800, PADDING = 60
    canvas.width = W
    const ctx = canvas.getContext('2d')
    const lines = poem.lines || []
    const lineH = 34
    canvas.height = PADDING * 2 + 80 + 36 + 20 + lines.length * lineH + 60
    const grad = ctx.createLinearGradient(0, 0, W, canvas.height)
    grad.addColorStop(0, '#1a1a2e')
    grad.addColorStop(1, '#16213e')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, canvas.height)
    ctx.strokeStyle = 'rgba(201,168,76,0.4)'
    ctx.lineWidth = 1
    ctx.strokeRect(20, 20, W - 40, canvas.height - 40)
    let y = PADDING
    ctx.fillStyle = '#e8d5a3'
    ctx.font = 'italic 300 36px Georgia'
    ctx.textAlign = 'center'
    ctx.fillText(poem.title, W / 2, y + 36)
    y += 80
    ctx.fillStyle = 'rgba(245,240,232,0.45)'
    ctx.font = 'italic 16px Georgia'
    ctx.fillText(poem.author, W / 2, y)
    y += 36
    ctx.strokeStyle = 'rgba(201,168,76,0.3)'
    ctx.beginPath(); ctx.moveTo(W / 2 - 40, y); ctx.lineTo(W / 2 + 40, y); ctx.stroke()
    y += 28
    ctx.fillStyle = 'rgba(245,240,232,0.85)'
    ctx.font = '18px Georgia'
    ctx.textAlign = 'left'
    lines.forEach(line => { ctx.fillText(line || '', PADDING, y); y += lineH })
    ctx.fillStyle = 'rgba(201,168,76,0.3)'
    ctx.font = 'italic 13px Georgia'
    ctx.textAlign = 'center'
    ctx.fillText('Verses', W / 2, canvas.height - PADDING / 2)
    const link = document.createElement('a')
    link.download = `${poem.title.replace(/\s+/g, '_')}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const openAnnotation = (i) => {
    setAnnotatingLine(i)
    setDraftNote(getNote(poem, i))
  }

  const saveAnnotation = () => {
    if (annotatingLine !== null) {
      setNote(poem, annotatingLine, draftNote)
      setAnnotatingLine(null)
      setDraftNote('')
    }
  }

  const poemNotes = getPoemNotes(poem)
  const noteCount = Object.keys(poemNotes).length

  return (
    <div
      className="reader-overlay"
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label={`Reading: ${poem.title}`}
    >
      <div className="reader-modal">
        <button className="reader-close" onClick={onClose} aria-label="Close">✕</button>

        {/* Toolbar: ambient + font size in one row */}
        {(flags.ambientSound || flags.fontSizeControl) && (
          <div className="reader-toolbar">
            {flags.ambientSound && <AmbientPlayer />}
            {flags.fontSizeControl && (
              <div className="reader-font-controls">
                {FONT_SIZES.map(f => (
                  <button
                    key={f.label}
                    className={`font-size-btn ${fontSize === f.value ? 'active' : ''}`}
                    onClick={() => setFontSize(f.value)}
                    aria-label={`Font size ${f.label}`}
                  >{f.label}</button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="reader-content">
          <p className="reader-label">✦ &nbsp; Reading &nbsp; ✦</p>
          <h2 className="reader-title">{poem.title}</h2>
          <p className="reader-author">{poem.author}</p>
          <div className="reader-divider" />

          {/* Annotatable lines */}
          <div className="reader-lines-wrap">
            {(poem.lines || []).map((line, i) => {
              const note = getNote(poem, i)
              return (
                <div key={i} className="reader-line-row">
                  <pre
                    className="reader-line"
                    style={{ fontSize }}
                    title={flags.annotations ? 'Click to annotate' : undefined}
                    onClick={() => flags.annotations && openAnnotation(i)}
                  >
                    {line || '\u00A0'}
                  </pre>
                  {flags.annotations && note && (
                    <span
                      className="line-note-indicator"
                      title={note}
                      onClick={() => openAnnotation(i)}
                    >✎</span>
                  )}
                </div>
              )
            })}
          </div>

          <div className="reader-divider" style={{ marginTop: '2.5rem' }} />

          {/* Panel toggles */}
          {(flags.poemStats || flags.annotations) && (
            <div className="reader-panel-tabs">
              {flags.poemStats && (
                <button
                  className={`reader-panel-tab ${activePanel === 'stats' ? 'active' : ''}`}
                  onClick={() => setActivePanel(p => p === 'stats' ? null : 'stats')}
                >Stats</button>
              )}
              {flags.annotations && (
                <button
                  className={`reader-panel-tab ${activePanel === 'notes' ? 'active' : ''}`}
                  onClick={() => setActivePanel(p => p === 'notes' ? null : 'notes')}
                >Notes {noteCount > 0 && `(${noteCount})`}</button>
              )}
              {flags.writingPrompt && (
                <button
                  className={`reader-panel-tab ${activePanel === 'prompt' ? 'active' : ''}`}
                  onClick={() => setActivePanel(p => p === 'prompt' ? null : 'prompt')}
                >Prompt</button>
              )}
              {flags.remix && (
                <button
                  className={`reader-panel-tab ${activePanel === 'remix' ? 'active' : ''}`}
                  onClick={() => setActivePanel(p => p === 'remix' ? null : 'remix')}
                >Remix</button>
              )}
            </div>
          )}

          {activePanel === 'stats' && flags.poemStats && <PoemStats poem={poem} />}

          {activePanel === 'notes' && flags.annotations && (
            <div className="notes-panel">
              {noteCount === 0 ? (
                <p className="notes-empty">Click any line while reading to add a note.</p>
              ) : (
                Object.entries(poemNotes).map(([idx, note]) => (
                  <div key={idx} className="note-item">
                    <p className="note-line-ref">Line {Number(idx) + 1}: <em>{poem.lines?.[idx]?.trim()}</em></p>
                    <p className="note-text">{note}</p>
                    <button className="note-edit-btn" onClick={() => openAnnotation(Number(idx))}>edit</button>
                  </div>
                ))
              )}
            </div>
          )}

          {activePanel === 'prompt' && flags.writingPrompt && <WritingPrompt poem={poem} />}

          {activePanel === 'remix' && flags.remix && (
            <PoemRemix
              poem={poem}
              collectionNames={collectionNames || []}
              onSaveToCollection={onAddToCollection || (() => {})}
            />
          )}

          <div className="reader-footer" style={{ marginTop: '1.5rem' }}>
            <span className="poem-line-count">{poem.linecount} lines</span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={handleCopy}>
                {copied ? 'Copied ✓' : 'Copy'}
              </button>
              {flags.shareImage && (
                <button className="btn btn-ghost" onClick={handleShareImage}>Save as image</button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Annotation modal */}
      {annotatingLine !== null && (
        <div className="annotation-modal" role="dialog" aria-label="Add note">
          <div className="annotation-box">
            <p className="annotation-line-preview">
              "{poem.lines?.[annotatingLine]?.trim()}"
            </p>
            <textarea
              className="annotation-input"
              placeholder="Your note…"
              value={draftNote}
              onChange={e => setDraftNote(e.target.value)}
              autoFocus
              rows={3}
            />
            <div className="annotation-actions">
              <button className="btn btn-ghost" onClick={() => { setAnnotatingLine(null); setDraftNote('') }}>
                Cancel
              </button>
              <button className="btn" onClick={saveAnnotation}>Save note</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
