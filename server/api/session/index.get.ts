import type { Submission } from '#shared/types/pretalx'
import type { SessionSummary } from '#shared/types/session'
import pretalxData from '#server/utils/pretalx'
import { buildSessionSummary, groupSessionsByDay } from '#server/utils/pretalx/sessions'

export default defineEventHandler(async () => {
  const data = await pretalxData()

  const submissions = data.submissions?.arr || []

  const sessions = submissions
    .filter((submission: Submission) => submission.state === 'confirmed')
    .map((submission: Submission) => buildSessionSummary(submission, data))
    .filter((session): session is SessionSummary => session !== null)

  return groupSessionsByDay(sessions)
})
