import type { Submission } from '#shared/types/pretalx'
import type { SessionSummary } from '~~/shared/types/session'
import pretalxData from '~~/server/utils/pretalx'
import { parseAnswer, parseSlot, parseSpeaker, parseType } from '~~/server/utils/pretalx/parser'

export default defineEventHandler(async () => {
  const data = await pretalxData()

  const submissions = data.submissions?.arr || []

  return submissions
    .filter((submission: Submission) => submission.state === 'confirmed')
    .map((submission: Submission) => {
      if (!submission.slots[0]) {
        return null
      }

      const answers = parseAnswer(submission.answers, data)
      const slot = parseSlot(submission.slots[0], data)
      const speakers = parseSpeaker(submission.speakers, data)
      const type = parseType(submission.submission_type, data)

      if (!slot || !slot.start || !slot.end || !slot.room) {
        return null
      }

      return {
        id: submission.code,
        room: slot.room.name,
        start: slot.start,
        end: slot.end,
        language: answers.language,
        speakers,
        zh: {
          title: submission.title,
          describe: submission.abstract,
          type: type.name['zh-hans'] || type.name.en,
        },
        en: {
          title: answers.enTitle || submission.title,
          describe: answers.enDesc || submission.abstract,
          type: type.name.en || type.name['zh-hans'],
        },
        tags: [],
        uri: `https://coscup.org/2026/session/${submission.code}`,
      }
    })
    .filter((session): session is NonNullable<typeof session> => session !== null)
    .reduce((acc, session) => {
      const day = session.start.slice(0, 10)
      if (!acc[day]) {
        acc[day] = []
      }
      acc[day].push(session)
      return acc
    }, {} as Record<string, SessionSummary[]>)
})
