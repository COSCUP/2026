import type { Submission } from '#shared/types/pretalx'
import type { SessionSummary, TrackDetail } from '#shared/types/session'
import type { Sponsor } from '#shared/types/sponsor'
import { sessions as pretalxData } from '#server/utils/pretalx'
import { buildSessionSummary, groupSessionsByDay } from '#server/utils/pretalx/sessions'
import { fetchSheet } from '#server/utils/sheets'
import { buildTrackColorMap, DEFAULT_TRACK_COLOR } from '#shared/utils/tracks'

export default defineEventHandler(async (event): Promise<TrackDetail> => {
  const id = Number(getRouterParam(event, 'id'))

  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid track id' })
  }

  const [data, allSponsors, sessionInfoRows] = await Promise.all([
    pretalxData(),
    $fetch<Sponsor[]>('/api/sponsor'),
    fetchSheet('session-info'),
  ])

  const track = data.tracks.map[id]

  if (!track) {
    throw createError({ statusCode: 404, statusMessage: 'Track not found' })
  }

  const submissions = data.submissions?.arr || []
  const submissionMap = new Map(submissions.map((s) => [s.code, s]))

  const confirmed = submissions
    .filter((submission: Submission) => submission.state === 'confirmed')
    .map((submission: Submission) => buildSessionSummary(submission, data))
    .filter((session): session is SessionSummary => session !== null)

  const sessions = confirmed.filter((session) => session.track?.id === id)

  // Merge session-info (co_write, slide, record) into each session summary.
  const sessionInfoMap = new Map(sessionInfoRows.map((row) => [row.id, row]))
  for (const session of sessions) {
    const info = sessionInfoMap.get(session.id)
    const submission = submissionMap.get(session.id)
    const answers = submission ? parseAnswer(submission.answers, 'session', data) : {}
    session.co_write = info?.co_write ?? null
    session.slide = info?.slide ?? answers.slide ?? null
    session.record = info?.record ?? null
  }

  const sessionsByDay = groupSessionsByDay(sessions)

  // Per-day card colour, from the same day-scoped palette the session table uses.
  const confirmedByDay = groupSessionsByDay(confirmed)
  const colors: Record<string, string> = {}
  for (const day of Object.keys(sessionsByDay)) {
    const dayColors = buildTrackColorMap(confirmedByDay[day] ?? [])
    colors[day] = dayColors.get(String(id)) ?? DEFAULT_TRACK_COLOR
  }

  const sponsors = allSponsors
    .filter((s) => s.track?.id === id)
    .map(({ id: sponsorId, name, link, image }) => ({ id: sponsorId, name, link, image }))

  return {
    id: track.id,
    name: track.name,
    description: track.description ?? { 'en': '', 'zh-hant': '' },
    sessions: sessionsByDay,
    colors,
    sponsors,
  }
})
