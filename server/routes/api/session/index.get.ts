import type { ISubmission } from '~~/server/utils/pretalx/type'
import pretalxData from '~~/server/utils/pretalx'
import { parseAnswer, parseSlot, parseSpeaker, parseType } from '~~/server/utils/pretalx/parser'

export default defineEventHandler(async () => {
  const data = await pretalxData()

  const submissions = data.submissions?.arr || []

  return submissions.map((submission: ISubmission) => {
    const answers = parseAnswer(submission.answers, data)
    const slot = parseSlot(submission.slots[0]!, data)
    const speakers = parseSpeaker(submission.speakers, data)
    const type = parseType(submission.submission_type, data)

    return {
      id: submission.code,
      room: slot.room?.name,
      start: slot.start,
      end: slot.end,
      lanaguage: answers.language,
      speakers,
      zh: {
        title: submission.title,
        describe: submission.abstract,
        type: type.name['zh-hans'] || type.name.en,
      },
      en: {
        title: answers.EnTitle || submission.title,
        describe: answers.EnDesc || submission.abstract,
        type: type.name.en || type.name['zh-hans'],
      },
      tags: [],
      uri: `https://coscup.org/2026/session/${submission.code}`,
    }
  })
})
