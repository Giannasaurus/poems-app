const MOODS = [
  { id: 'any',    label: 'Any',    desc: 'all lengths',   min: 0,   max: Infinity },
  { id: 'short',  label: 'Short',  desc: '≤ 10 lines',    min: 0,   max: 10 },
  { id: 'medium', label: 'Medium', desc: '11–30 lines',   min: 11,  max: 30 },
  { id: 'epic',   label: 'Epic',   desc: '31+ lines',     min: 31,  max: Infinity },
]

export default function MoodFilter({ value, onChange }) {
  return (
    <div className="mood-filter" role="group" aria-label="Filter by poem length">
      {MOODS.map(m => (
        <button
          key={m.id}
          className={`mood-btn ${value === m.id ? 'active' : ''}`}
          onClick={() => onChange(m.id)}
          title={m.desc}
        >
          {m.label}
          <span className="mood-desc">{m.desc}</span>
        </button>
      ))}
    </div>
  )
}

export const MOOD_DEFS = MOODS

export function filterByMood(poems, moodId) {
  const mood = MOODS.find(m => m.id === moodId)
  if (!mood || moodId === 'any') return poems
  return poems.filter(p => {
    const count = Number(p.linecount) || p.lines?.length || 0
    return count >= mood.min && count <= mood.max
  })
}
