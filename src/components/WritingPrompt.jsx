import { useState, useEffect } from 'react'

const PROMPT_TEMPLATES = [
  (line) => `Continue this thought: "${line}"`,
  (line) => `Write a response to: "${line}"`,
  (line) => `What memory does this line evoke? "${line}"`,
  (line) => `Rewrite this line from a different perspective: "${line}"`,
  (line) => `Use this as your opening line and write what comes next: "${line}"`,
]

function pickPrompt(line, seed) {
  const idx = seed % PROMPT_TEMPLATES.length
  return PROMPT_TEMPLATES[idx](line)
}

export default function WritingPrompt({ poem }) {
  const [draft, setDraft] = useState('')
  const [saved, setSaved] = useState(false)

  // Pick a "interesting" line — not blank, not too short
  const sourceLine = poem?.lines?.find(l => l.trim().length > 20) || poem?.lines?.[0] || ''
  const seed = poem ? poem.title.length + poem.author.length : 0
  const prompt = sourceLine ? pickPrompt(sourceLine, seed) : null

  // Reset draft when poem changes
  useEffect(() => { setDraft(''); setSaved(false) }, [poem?.title])

  const handleSave = () => {
    if (!draft.trim()) return
    const key = 'verses_prompts'
    try {
      const existing = JSON.parse(localStorage.getItem(key)) || []
      existing.unshift({ prompt, draft, poem: poem?.title, savedAt: new Date().toISOString() })
      localStorage.setItem(key, JSON.stringify(existing.slice(0, 50)))
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch { /* silent */ }
  }

  if (!prompt) return null

  return (
    <div className="writing-prompt">
      <p className="writing-prompt-label">✎ &nbsp; Writing Prompt</p>
      <p className="writing-prompt-text">{prompt}</p>
      <textarea
        className="writing-prompt-input"
        placeholder="Write your response…"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        rows={4}
      />
      <div className="writing-prompt-footer">
        <span className="writing-prompt-hint">Your response is private</span>
        <button className="btn btn-ghost" style={{ fontSize: '0.8rem' }} onClick={handleSave}>
          {saved ? 'Saved ✓' : 'Save response'}
        </button>
      </div>
    </div>
  )
}
