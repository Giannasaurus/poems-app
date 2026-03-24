import { THEME_NAMES, THEME_LABELS } from '../hooks/useTheme'

export default function ThemeSwitcher({ theme, setTheme }) {
  return (
    <div className="theme-switcher" aria-label="Choose theme">
      {THEME_NAMES.map(t => (
        <button
          key={t}
          className={`theme-btn theme-btn--${t} ${theme === t ? 'active' : ''}`}
          onClick={() => setTheme(t)}
          title={THEME_LABELS[t]}
          aria-label={`${THEME_LABELS[t]} theme`}
          aria-pressed={theme === t}
        />
      ))}
    </div>
  )
}
