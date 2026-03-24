import { useState } from 'react'

export default function SearchBar({ onSearch, onRandom, loading, searchRef }) {
  const [query, setQuery] = useState('')
  const [searchBy, setSearchBy] = useState('title')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query, searchBy)
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <input
        ref={searchRef}
        className="search-input"
        type="text"
        placeholder={searchBy === 'title' ? 'Search by title…' : 'Search by author…'}
        value={query}
        onChange={e => setQuery(e.target.value)}
        aria-label="Search poems"
      />
      <select
        className="search-select"
        value={searchBy}
        onChange={e => setSearchBy(e.target.value)}
        aria-label="Search by"
      >
        <option value="title">Title</option>
        <option value="author">Author</option>
      </select>
      <button className="btn" type="submit" disabled={loading}>
        Search
      </button>
      <button className="btn btn-ghost" type="button" onClick={onRandom} disabled={loading}>
        Random
      </button>
    </form>
  )
}
