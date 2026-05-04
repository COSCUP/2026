import type { PretalxResult } from '#shared/types/pretalx'
import { fetchAnswers, fetchRooms, fetchSlots, fetchSpeakers, fetchSubmissions, fetchSubmissionTypes } from './fetch'

export default async () => {
  const [submissions, submissionTypes, speakers, rooms, answers, slots] = await Promise.all([
    fetchSubmissions(),
    fetchSubmissionTypes(),
    fetchSpeakers(),
    fetchRooms(),
    fetchAnswers(),
    fetchSlots(),
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
