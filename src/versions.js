// Central version registry — feature flags + metadata
const BASE_OFF = {
  readingMode: false, historyTab: false, readingTime: false, copyBtn: false,
  collapseScroll: false, poemOfDay: false, authorDive: false, fontSizeControl: false,
  moodFilter: false, shareImage: false, annotations: false, collections: false,
  streak: false, ambientSound: false, poemStats: false,
  themes: false, remix: false, writingPrompt: false, compareMode: false, keyboardShortcuts: false,
  auth: false, cloudSync: false,
}

export const VERSIONS = [
  {
    id: '1.0', label: 'v1.0', title: 'Initial Release',
    features: [
      'Featured poem with typewriter effect',
      'Explore tab — search by title or author',
      'Favorites with localStorage persistence',
      'Particle canvas background',
    ],
    flags: { ...BASE_OFF },
  },
  {
    id: '2.1', label: 'v2.1', title: 'Expanded Experience',
    features: [
      'Immersive full-screen reading mode',
      'Reading history tab with timestamps',
      'Reading time estimate on each card',
      'Copy poem to clipboard',
      'Click expanded card to collapse & scroll',
    ],
    flags: { ...BASE_OFF, readingMode: true, historyTab: true, readingTime: true, copyBtn: true, collapseScroll: true },
  },
  {
    id: '3.0', label: 'v3.0', title: 'Deep Immersion',
    features: [
      'Poem of the Day — deterministic daily pick',
      'Author deep-dive — browse all poems by an author',
      'Mood filter — short, medium, or epic poems',
      'Font size control in reading mode',
      'Share poem as a downloadable image',
    ],
    flags: { ...BASE_OFF, readingMode: true, historyTab: true, readingTime: true, copyBtn: true, collapseScroll: true, poemOfDay: true, authorDive: true, fontSizeControl: true, moodFilter: true, shareImage: true },
  },
  {
    id: '4.0', label: 'v4.0', title: 'Your Personal Library',
    features: [
      'Line annotations — click any line to leave a note',
      'Collections — organise poems into named shelves',
      'Reading streak — tracks consecutive daily visits',
      'Ambient sound — rain or fireplace while you read',
      'Poem stats — word frequency chart & line analysis',
    ],
    flags: { ...BASE_OFF, readingMode: true, historyTab: true, readingTime: true, copyBtn: true, collapseScroll: true, poemOfDay: true, authorDive: true, fontSizeControl: true, moodFilter: true, shareImage: true, annotations: true, collections: true, streak: true, ambientSound: true, poemStats: true },
  },
  {
    id: '5.0', label: 'v5.0', title: 'The Living Page',
    features: [
      'Themes — Dark, Midnight Blue, Sepia ink',
      'Poem Remix — shuffle lines into new arrangements',
      'Daily Writing Prompt — inspired by the featured poem',
      'Compare Mode — pin two poems side by side',
      'Keyboard shortcuts — R for random, / for search',
    ],
    flags: { ...BASE_OFF, readingMode: true, historyTab: true, readingTime: true, copyBtn: true, collapseScroll: true, poemOfDay: true, authorDive: true, fontSizeControl: true, moodFilter: true, shareImage: true, annotations: true, collections: true, streak: true, ambientSound: true, poemStats: true, themes: true, remix: true, writingPrompt: true, compareMode: true, keyboardShortcuts: true },
  },
  {
    id: '6.0', label: 'v6.0', title: 'The Real App',
    features: [
      'User accounts — sign up with email, Google, or GitHub',
      'Cloud sync — favorites, collections, annotations & history follow you',
      'Reading streak synced across devices',
      'Seamless localStorage fallback when signed out',
      'Deployed live on Vercel',
    ],
    flags: { ...BASE_OFF, readingMode: true, historyTab: true, readingTime: true, copyBtn: true, collapseScroll: true, poemOfDay: true, authorDive: true, fontSizeControl: true, moodFilter: true, shareImage: true, annotations: true, collections: true, streak: true, ambientSound: true, poemStats: true, themes: true, remix: true, writingPrompt: true, compareMode: true, keyboardShortcuts: true, auth: true, cloudSync: true },
  },
]

export const getVersion = (id) => VERSIONS.find(v => v.id === id) ?? VERSIONS[5]
export const getFlags = (id) => getVersion(id).flags
