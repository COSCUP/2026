import type { Submission } from '#shared/types/pretalx'
import type { SessionSummary, TrackSummary } from '#shared/types/session'
import pretalxData from '#server/utils/pretalx'
import { buildSessionSummary } from '#server/utils/pretalx/sessions'

export default defineEventHandler(async (): Promise<TrackSummary[]> => {
  const data = await pretalxData()

  const submissions = data.submissions?.arr || []

  const counts = new Map<number, number>()
  submissions
    .filter((submission: Submission) => submission.state === 'confirmed')
    .map((submission: Submission) => buildSessionSummary(submission, data))
    .filter((session): session is SessionSummary => session !== null)
    .forEach((session) => {
      if (session.track) {
        counts.set(session.track.id, (counts.get(session.track.id) ?? 0) + 1)
      }
    })

  return data.tracks.arr
    .map((track) => ({ id: track.id, name: track.name, count: counts.get(track.id) ?? 0 }))
    .sort((a, b) => b.count - a.count || a.id - b.id)
})
