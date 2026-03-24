export default function StreakBadge({ streak }) {
  if (!streak || streak < 1) return null
  const flame = streak >= 7 ? '🔥' : streak >= 3 ? '✦' : '·'
  return (
    <div className="streak-badge" title={`${streak}-day reading streak`} aria-label={`${streak} day reading streak`}>
      <span className="streak-flame">{flame}</span>
      <span className="streak-count">{streak}</span>
      <span className="streak-label">day streak</span>
    </div>
  )
}
