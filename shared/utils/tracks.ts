import type { SessionSummary, SessionTrack } from '#shared/types/session'

// Per-track solid card background, ordered by sorted track index (from the Figma spec §5).
// Shared by both the room table (CpSessionTable) and server-rendered session detail pages
// so a given track keeps the same colour in either view.
export const TRACK_COLORS = [
  '#e76f51',
  '#ff6b6b',
  '#4ecdc4',
  '#45b7d1',
  '#ffa07a',
  '#98d8c8',
  '#f7dc6f',
  '#bb8fce',
  '#85c1e2',
  '#f8b195',
  '#f67280',
  '#c06c84',
  '#6c5b7b',
  '#355c7d',
  '#2a9d8f',
  '#264653',
  '#e9c46a',
  '#f4a261',
  '#e63946',
  '#457b9d',
  '#1d3557',
  '#a8dadc',
]

// Track-less sessions collapse into one fallback bucket so nothing disappears.
export const NO_TRACK = '__none__'

export function trackKey(session: SessionSummary): string {
  return session.track?.id != null ? String(session.track.id) : NO_TRACK
}

// Match by name (either locale) since Pretalx track ids aren't stable across events.
const MAIN_TRACK_NAMES = ['主議程', 'Main Session Track']
export function isMainTrack(name?: SessionTrack['name']): boolean {
  return MAIN_TRACK_NAMES.includes(name?.['zh-hant'] ?? '') || MAIN_TRACK_NAMES.includes(name?.en ?? '')
}

/**
 * Assign a stable colour per track: distinct tracks sorted by id (track-less last),
 * indexed into the palette. Both table views build this from the same day's sessions,
 * so a track resolves to the same colour in either layout.
 */
export function buildTrackColorMap(sessions: SessionSummary[]): Map<string, string> {
  const order = new Map<string, number>()
  for (const session of sessions) {
    const key = trackKey(session)
    if (!order.has(key)) {
      order.set(key, session.track?.id ?? Number.POSITIVE_INFINITY)
    }
  }
  const sorted = [...order.entries()].sort((a, b) => a[1] - b[1])
  return new Map(sorted.map(([key], index) => [key, TRACK_COLORS[index % TRACK_COLORS.length]!]))
}
