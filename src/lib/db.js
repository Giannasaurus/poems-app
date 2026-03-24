/**
 * Cloud sync helpers — all operations are no-ops when user is null (localStorage fallback).
 * Table schemas expected in Supabase:
 *
 * favorites:    (id, user_id, poem_title, poem_author, poem_lines, poem_linecount, created_at)
 * history:      (id, user_id, poem_title, poem_author, poem_lines, poem_linecount, read_at)
 * collections:  (id, user_id, name, poem_title, poem_author, poem_lines, poem_linecount, created_at)
 * annotations:  (id, user_id, poem_key, line_index, note, updated_at)
 * streaks:      (id, user_id, count, last_date)
 */

import { supabase } from './supabase'

const poemRow = (userId, poem) => ({
  user_id: userId,
  poem_title: poem.title,
  poem_author: poem.author,
  poem_lines: poem.lines,
  poem_linecount: poem.linecount,
})

const rowToPoem = (row) => ({
  title: row.poem_title,
  author: row.poem_author,
  lines: row.poem_lines,
  linecount: row.poem_linecount,
})

// ── Favorites ──────────────────────────────────────────────────────────────

export async function fetchFavorites(userId) {
  const { data } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return (data || []).map(rowToPoem)
}

export async function addFavorite(userId, poem) {
  await supabase.from('favorites').upsert(
    { ...poemRow(userId, poem) },
    { onConflict: 'user_id,poem_title,poem_author' }
  )
}

export async function removeFavorite(userId, poem) {
  await supabase.from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('poem_title', poem.title)
    .eq('poem_author', poem.author)
}

// ── History ─────────────────────────────────────────────────────────────────

export async function fetchHistory(userId) {
  const { data } = await supabase
    .from('history')
    .select('*')
    .eq('user_id', userId)
    .order('read_at', { ascending: false })
    .limit(30)
  return (data || []).map(r => ({ ...rowToPoem(r), readAt: r.read_at }))
}

export async function addHistory(userId, poem) {
  // Remove existing entry first to avoid duplicates
  await supabase.from('history')
    .delete()
    .eq('user_id', userId)
    .eq('poem_title', poem.title)
    .eq('poem_author', poem.author)
  await supabase.from('history').insert({
    ...poemRow(userId, poem),
    read_at: new Date().toISOString(),
  })
}

export async function clearHistory(userId) {
  await supabase.from('history').delete().eq('user_id', userId)
}

// ── Collections ─────────────────────────────────────────────────────────────

export async function fetchCollections(userId) {
  const { data } = await supabase
    .from('collections')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (!data) return {}
  return data.reduce((acc, row) => {
    if (!acc[row.name]) acc[row.name] = []
    acc[row.name].push(rowToPoem(row))
    return acc
  }, {})
}

export async function addToCollection(userId, name, poem) {
  await supabase.from('collections').upsert(
    { ...poemRow(userId, poem), name },
    { onConflict: 'user_id,name,poem_title,poem_author' }
  )
}

export async function removeFromCollection(userId, name, poem) {
  await supabase.from('collections')
    .delete()
    .eq('user_id', userId)
    .eq('name', name)
    .eq('poem_title', poem.title)
    .eq('poem_author', poem.author)
}

export async function deleteCollection(userId, name) {
  await supabase.from('collections')
    .delete()
    .eq('user_id', userId)
    .eq('name', name)
}

// ── Annotations ─────────────────────────────────────────────────────────────

export async function fetchAnnotations(userId) {
  const { data } = await supabase
    .from('annotations')
    .select('*')
    .eq('user_id', userId)
  if (!data) return {}
  return data.reduce((acc, row) => {
    if (!acc[row.poem_key]) acc[row.poem_key] = {}
    acc[row.poem_key][row.line_index] = row.note
    return acc
  }, {})
}

export async function upsertAnnotation(userId, poemKey, lineIndex, note) {
  if (!note.trim()) {
    await supabase.from('annotations')
      .delete()
      .eq('user_id', userId)
      .eq('poem_key', poemKey)
      .eq('line_index', lineIndex)
  } else {
    await supabase.from('annotations').upsert(
      { user_id: userId, poem_key: poemKey, line_index: lineIndex, note, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,poem_key,line_index' }
    )
  }
}

// ── Streak ───────────────────────────────────────────────────────────────────

export async function fetchStreak(userId) {
  const { data } = await supabase
    .from('streaks')
    .select('*')
    .eq('user_id', userId)
    .single()
  return data || null
}

export async function upsertStreak(userId, count, lastDate) {
  await supabase.from('streaks').upsert(
    { user_id: userId, count, last_date: lastDate },
    { onConflict: 'user_id' }
  )
}
