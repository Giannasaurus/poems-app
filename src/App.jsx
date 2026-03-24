import { useEffect, useRef, useState } from 'react'
import { useVersion } from './context/VersionContext'
import { useAuth } from './context/AuthContext'
import { getFlags } from './versions'
import ParticleCanvas from './components/ParticleCanvas'
import VersionBadge from './components/VersionBadge'
import FeaturedPoem from './components/FeaturedPoem'
import PoemOfDay from './components/PoemOfDay'
import SearchBar from './components/SearchBar'
import PoemCard from './components/PoemCard'
import FavoritesList from './components/FavoritesList'
import HistoryList from './components/HistoryList'
import ReadingMode from './components/ReadingMode'
import AuthorDive from './components/AuthorDive'
import MoodFilter, { filterByMood } from './components/MoodFilter'
import CollectionsPanel from './components/CollectionsPanel'
import StreakBadge from './components/StreakBadge'
import ThemeSwitcher from './components/ThemeSwitcher'
import CompareMode from './components/CompareMode'
import AuthPanel from './components/AuthPanel'
import { usePoems } from './hooks/usePoems'
import { useFavorites } from './hooks/useFavorites'
import { useReadingHistory } from './hooks/useReadingHistory'
import { useCollections } from './hooks/useCollections'
import { useStreak } from './hooks/useStreak'
import { useTheme } from './hooks/useTheme'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'

export default function App() {
  const { version } = useVersion()
  const flags = getFlags(version)
  const { user, signOut } = useAuth()

  const { poems, loading, error, fetchPoems } = usePoems()
  const { favorites, toggle, isFavorite } = useFavorites()
  const { history, addToHistory, clearHistory } = useReadingHistory()
  const { collections, collectionNames, createCollection, deleteCollection, addToCollection, removeFromCollection } = useCollections()
  const streak = useStreak()
  const { theme, setTheme } = useTheme()

  const [tab, setTab] = useState('explore')
  const [readerPoem, setReaderPoem] = useState(null)
  const [authorDive, setAuthorDive] = useState(null)
  const [mood, setMood] = useState('any')
  const [compareOpen, setCompareOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const searchRef = useRef(null)

  useKeyboardShortcuts({
    onRandom: flags.keyboardShortcuts ? () => fetchPoems() : null,
    onFocusSearch: flags.keyboardShortcuts ? () => searchRef.current?.focus() : null,
    readerOpen: !!readerPoem,
  })

  useEffect(() => {
    if (tab === 'history' && !flags.historyTab) setTab('explore')
    if (tab === 'collections' && !flags.collections) setTab('explore')
  }, [version, flags.historyTab, flags.collections, tab])

  useEffect(() => { fetchPoems() }, [fetchPoems])

  const openReader = (poem) => {
    if (flags.historyTab) addToHistory(poem)
    setReaderPoem(poem)
  }

  const displayedPoems = flags.moodFilter ? filterByMood(poems, mood) : poems

  const tabs = [
    { id: 'explore',     label: 'Explore' },
    { id: 'favorites',   label: `Favorites${favorites.length > 0 ? ` (${favorites.length})` : ''}` },
    ...(flags.historyTab    ? [{ id: 'history',     label: `History${history.length > 0 ? ` (${history.length})` : ''}` }] : []),
    ...(flags.collections   ? [{ id: 'collections', label: `Collections${collectionNames.length > 0 ? ` (${collectionNames.length})` : ''}` }] : []),
  ]

  return (
    <>
      <ParticleCanvas />
      <div className="app">
        <header className="header">
          <VersionBadge />
          {flags.streak && streak > 0 && <StreakBadge streak={streak} />}
          {flags.auth && (
            <div className="auth-header-btn">
              {user ? (
                <div className="auth-user">
                  <span className="auth-avatar" title={user.email}>
                    {(user.user_metadata?.avatar_url)
                      ? <img src={user.user_metadata.avatar_url} alt="avatar" />
                      : user.email?.[0]?.toUpperCase()}
                  </span>
                  <button className="auth-signout" onClick={signOut}>Sign out</button>
                </div>
              ) : (
                <button className="auth-signin-trigger" onClick={() => setAuthOpen(true)}>Sign in</button>
              )}
            </div>
          )}
          <h1 className="header-title">Verses</h1>
          <p className="header-subtitle">a quiet place for poetry</p>
          <div className="header-divider" />
          {flags.themes && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <ThemeSwitcher theme={theme} setTheme={setTheme} />
            </div>
          )}
        </header>

        {flags.poemOfDay && <PoemOfDay onOpenReader={openReader} />}
        <FeaturedPoem onOpenReader={openReader} />

        {flags.authorDive && authorDive ? (
          <AuthorDive
            author={authorDive}
            isFavorite={isFavorite}
            onToggleFavorite={toggle}
            onOpenReader={openReader}
            onClose={() => setAuthorDive(null)}
          />
        ) : flags.compareMode && compareOpen ? (
          <CompareMode
            poems={poems}
            isFavorite={isFavorite}
            onToggleFavorite={toggle}
            onOpenReader={openReader}
            onClose={() => setCompareOpen(false)}
          />
        ) : (
          <>
            <nav className="tabs" aria-label="Main navigation">
              {tabs.map(t => (
                <button
                  key={t.id}
                  className={`tab ${tab === t.id ? 'active' : ''}`}
                  onClick={() => setTab(t.id)}
                >{t.label}</button>
              ))}
              {flags.compareMode && poems.length >= 2 && (
                <button className="tab" onClick={() => setCompareOpen(true)}>Compare</button>
              )}
            </nav>

            {tab === 'explore' && (
              <>
                <SearchBar
                  onSearch={(q, by) => fetchPoems(q, by)}
                  onRandom={() => fetchPoems()}
                  loading={loading}
                  searchRef={searchRef}
                />
                {flags.moodFilter && <MoodFilter value={mood} onChange={setMood} />}
                {loading && <div className="loading"><span className="loading-dots"><span>·</span><span>·</span><span>·</span></span></div>}
                {error && <div className="error"><p>Something went wrong. Try again.</p></div>}
                {!loading && !error && displayedPoems.length === 0 && (
                  <div className="empty">{poems.length > 0 ? 'No poems match this filter.' : 'No poems found.'}</div>
                )}
                {!loading && displayedPoems.length > 0 && (
                  <div className="poem-grid">
                    {displayedPoems.map((poem, i) => (
                      <PoemCard
                        key={`${poem.title}-${i}`}
                        poem={poem}
                        isFavorite={isFavorite(poem)}
                        onToggleFavorite={toggle}
                        onOpenReader={openReader}
                        onAuthorClick={flags.authorDive ? setAuthorDive : undefined}
                        onAddToCollection={addToCollection}
                        collectionNames={flags.collections ? collectionNames : []}
                      />
                    ))}
                  </div>
                )}
                {flags.keyboardShortcuts && (
                  <p className="shortcuts-hint">R — random &nbsp;·&nbsp; / — search</p>
                )}
              </>
            )}

            {tab === 'favorites' && (
              <FavoritesList favorites={favorites} isFavorite={isFavorite} onToggleFavorite={toggle} onOpenReader={openReader} />
            )}

            {tab === 'history' && flags.historyTab && (
              <HistoryList history={history} isFavorite={isFavorite} onToggleFavorite={toggle} onOpenReader={openReader} onClear={clearHistory} />
            )}

            {tab === 'collections' && flags.collections && (
              <CollectionsPanel
                collections={collections}
                collectionNames={collectionNames}
                onCreateCollection={createCollection}
                onDeleteCollection={deleteCollection}
                onRemoveFromCollection={removeFromCollection}
                isFavorite={isFavorite}
                onToggleFavorite={toggle}
                onOpenReader={openReader}
              />
            )}
          </>
        )}
      </div>

      {readerPoem && (
        <ReadingMode
          poem={readerPoem}
          onClose={() => setReaderPoem(null)}
          collectionNames={flags.collections ? collectionNames : []}
          onAddToCollection={addToCollection}
        />
      )}
      {authOpen && <AuthPanel onClose={() => setAuthOpen(false)} />}
    </>
  )
}
