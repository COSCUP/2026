import type { PretalxResult } from '#shared/types/pretalx'

import { fetchPretalxTable } from './fetch'

export default async () => {
  const [submissions, submissionTypes, speakers, rooms, answers, slots] = await Promise.all([
    fetchPretalxTable('submissions'),
    fetchPretalxTable('submission-types'),
    fetchPretalxTable('speakers'),
    fetchPretalxTable('rooms'),
    fetchPretalxTable('answers'),
    fetchPretalxTable('slots'),
  ])

  return {
    submissions,
    speakers,
    rooms,
    answers,
    slots,
    'submission-types': submissionTypes,
  } satisfies PretalxResult
}
