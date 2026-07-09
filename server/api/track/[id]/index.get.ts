import type { Submission } from '#shared/types/pretalx'
import type { SessionSummary, TrackDetail } from '#shared/types/session'
import pretalxData from '#server/utils/pretalx'
import { buildSessionSummary, groupSessionsByDay } from '#server/utils/pretalx/sessions'

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

  const sessions = submissions
    .filter((submission: Submission) => submission.state === 'confirmed' && submission.track === id)
    .map((submission: Submission) => buildSessionSummary(submission, data))
    .filter((session): session is SessionSummary => session !== null)

  return {
    id: track.id,
    name: track.name,
    description: track.description ?? { 'en': '', 'zh-hant': '' },
    sessions: groupSessionsByDay(sessions),
  }
})
