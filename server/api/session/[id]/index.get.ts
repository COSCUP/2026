import pretalxData from '#server/utils/pretalx'
import { parseAnswer, parseDifficulty, parseSlot, parseSpeaker, parseTags, parseTrack, parseType } from '#server/utils/pretalx/parser'

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

  if (submission.slots[0] === undefined) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Slot not found',
    })
  }

  if (submission.state !== 'confirmed') {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
    })
  }

  const answers = parseAnswer(submission.answers, data)
  const slot = parseSlot(submission.slots[0], data)
  const speakers = parseSpeaker(submission.speakers, data)
  const type = parseType(submission.submission_type, data)

  return {
    id: submission.code,
    room: slot?.room?.name,
    start: slot?.start,
    end: slot?.end,
    language: answers.language,
    track: parseTrack(submission.track, data),
    speakers,
    zh: {
      title: submission.title,
      describe: submission.abstract,
      type: type.name['zh-hant'] || type.name.en,
    },
    en: {
      title: answers.enTitle || submission.title,
      describe: answers.enDesc || submission.abstract,
      type: type.name.en || type.name['zh-hant'],
    },
    tags: parseTags(submission.tags, data, parseDifficulty(answers.difficulty)),
    uri: `https://coscup.org/2026/session/${submission.code}`,
    co_write: null,
    qa: null,
    slide: null,
    record: null,
  }
})
