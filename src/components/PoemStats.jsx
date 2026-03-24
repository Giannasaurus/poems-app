const STOP_WORDS = new Set(['the','a','an','and','or','but','in','on','at','to','for',
  'of','with','by','from','is','was','are','were','be','been','it','its','i','my',
  'me','he','she','they','we','you','his','her','their','our','your','that','this',
  'as','so','if','not','no','nor','yet','both','either','than','then','when','where',
  'who','which','what','how','all','each','every','more','most','such','into','up',
  'out','do','did','does','had','has','have','will','would','could','should','may',
  'might','shall','can','upon','o','thy','thee','thou','thine','hath','doth'])

function getTopWords(lines, n = 8) {
  const freq = {}
  lines.forEach(line => {
    line.toLowerCase().replace(/[^a-z\s'-]/g, '').split(/\s+/).forEach(w => {
      const clean = w.replace(/^['-]+|['-]+$/g, '')
      if (clean.length > 2 && !STOP_WORDS.has(clean)) {
        freq[clean] = (freq[clean] || 0) + 1
      }
    })
  })
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
}

export default function PoemStats({ poem }) {
  const lines = poem.lines || []
  const words = lines.join(' ').split(/\s+/).filter(Boolean)
  const wordCount = words.length
  const charCount = lines.join('').length
  const longestLine = lines.reduce((a, b) => b.length > a.length ? b : a, '')
  const avgLineLen = lines.length ? Math.round(charCount / lines.length) : 0
  const topWords = getTopWords(lines)
  const maxFreq = topWords[0]?.[1] || 1

  return (
    <div className="poem-stats">
      <p className="stats-title">Poem Stats</p>

      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-value">{wordCount}</span>
          <span className="stat-label">words</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{lines.length}</span>
          <span className="stat-label">lines</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{avgLineLen}</span>
          <span className="stat-label">avg chars/line</span>
        </div>
      </div>

      {longestLine && (
        <div className="stat-longest">
          <span className="stat-label">longest line</span>
          <p className="stat-longest-text">"{longestLine.trim()}"</p>
        </div>
      )}

      {topWords.length > 0 && (
        <div className="stat-words">
          <span className="stat-label">top words</span>
          <div className="word-bars">
            {topWords.map(([word, count]) => (
              <div key={word} className="word-bar-row">
                <span className="word-bar-label">{word}</span>
                <div className="word-bar-track">
                  <div
                    className="word-bar-fill"
                    style={{ width: `${(count / maxFreq) * 100}%` }}
                  />
                </div>
                <span className="word-bar-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
