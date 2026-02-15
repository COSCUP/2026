import pretalxData from '~~/server/utils/pretalx'
import { parseAnswer, parseSlot, parseSpeaker } from '~~/server/utils/pretalx/parser'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!

  const data = await pretalxData()
  const submission = data.submissions?.map[id]

  if (!submission) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
    })
  }

  const answers = parseAnswer(submission.answers, data)
  const slot = parseSlot(submission.slots[0], data)
  const speakers = parseSpeaker(submission.speakers, data)

  return {
    id: submission.code,
    type: submission.submission_type,
    room: slot.room?.name,
    start: slot.start,
    end: slot.end,
    lanaguage: answers.language,
    speakers,
    zh: {
      title: submission.title,
      describe: submission.abstract,
    },
    en: {
      title: answers.EnTitle || submission.title,
      describe: answers.EnDesc || submission.abstract,
    },
    tags: [],
    uri: `https://coscup.org/2026/session/${submission.code}`,
    co_write: null,
    qa: null,
    slide: null,
    record: null,
  }
})
