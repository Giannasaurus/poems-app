import { useState, useRef, useEffect } from 'react'
import { VERSIONS } from '../versions'
import { useVersion } from '../context/VersionContext'

export default function VersionBadge() {
  const { version, setVersion } = useVersion()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const current = VERSIONS.find(v => v.id === version) ?? VERSIONS[2]

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="version-badge" ref={ref}>
      <button
        className="version-trigger"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select version"
      >
        {current.label}
        <span className="version-caret" style={{ transform: open ? 'rotate(180deg)' : 'none' }}>▾</span>
      </button>

      {open && (
        <div className="version-dropdown" role="listbox" aria-label="App versions">
          {VERSIONS.map(v => (
            <button
              key={v.id}
              role="option"
              aria-selected={v.id === version}
              className={`version-option ${v.id === version ? 'active' : ''}`}
              onClick={() => { setVersion(v.id); setOpen(false) }}
            >
              <div className="version-option-header">
                <span className="version-option-label">{v.label}</span>
                <span className="version-option-title">{v.title}</span>
              </div>
              <ul className="version-feature-list">
                {v.features.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
