import type { SessionSummary } from '#shared/types/session'
import pretalxData from '#server/utils/pretalx'
import { buildSessionSummary } from '#server/utils/pretalx/sessions'
import { buildTrackColorMap, DEFAULT_TRACK_COLOR, trackKey } from '#shared/utils/tracks'

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

  const session = buildSessionSummary(submission, data)
  if (!session) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
    })
  }

  const day = session.start!.slice(0, 10)
  const daySessions = data.submissions.arr
    .filter((item) => item.state === 'confirmed')
    .map((item) => buildSessionSummary(item, data))
    .filter((item): item is SessionSummary => item !== null && item.start?.startsWith(day) === true)

  const trackColors = buildTrackColorMap(daySessions)

  return {
    ...session,
    trackColor: trackColors.get(trackKey(session)) ?? DEFAULT_TRACK_COLOR,
    co_write: null,
    qa: null,
    slide: null,
    record: null,
  }
})
