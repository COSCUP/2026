import type { Submission } from '#shared/types/pretalx'
import type { SessionSummary, TrackDetail } from '#shared/types/session'
import pretalxData from '#server/utils/pretalx'
import { buildSessionSummary, groupSessionsByDay } from '#server/utils/pretalx/sessions'
import { buildTrackColorMap, DEFAULT_TRACK_COLOR } from '#shared/utils/tracks'

export default defineEventHandler(async (event): Promise<TrackDetail> => {
  const id = Number(getRouterParam(event, 'id'))

  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid track id' })
  }

  const data = await pretalxData()
  const track = data.tracks.map[id]

  if (!track) {
    throw createError({ statusCode: 404, statusMessage: 'Track not found' })
  }

  const submissions = data.submissions?.arr || []

  const confirmed = submissions
    .filter((submission: Submission) => submission.state === 'confirmed')
    .map((submission: Submission) => buildSessionSummary(submission, data))
    .filter((session): session is SessionSummary => session !== null)

  const sessions = confirmed.filter((session) => session.track?.id === id)
  const sessionsByDay = groupSessionsByDay(sessions)

  // Per-day card colour, from the same day-scoped palette the session table uses.
  const confirmedByDay = groupSessionsByDay(confirmed)
  const colors: Record<string, string> = {}
  for (const day of Object.keys(sessionsByDay)) {
    const dayColors = buildTrackColorMap(confirmedByDay[day] ?? [])
    colors[day] = dayColors.get(String(id)) ?? DEFAULT_TRACK_COLOR
  }

  return {
    id: track.id,
    name: track.name,
    description: track.description ?? { 'en': '', 'zh-hant': '' },
    sessions: sessionsByDay,
    colors,
  }
})
