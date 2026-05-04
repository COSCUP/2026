import type { H3Event } from 'h3'
import type { Answer, Slot, Speaker, Submission } from '#shared/types/pretalx'
import { SpeakerSchema, SubmissionSchema } from '#shared/types/pretalx'
import { fetchPretalxTable } from './table'

async function fetchConfirmedSubmissions(event: H3Event): Promise<Submission[]> {
  const submissions = await fetchPretalxTable(event, 'submissions', SubmissionSchema)
  return submissions.filter((submission) => submission.state === 'confirmed')
}

export async function filterSpeakersReachableFromConfirmedSubmissions(
  speakers: Speaker[],
  event: H3Event,
): Promise<Speaker[]> {
  const submissions = await fetchConfirmedSubmissions(event)
  const speakerCodes = new Set(submissions.flatMap((submission) => submission.speakers))

  return speakers.filter((speaker) => speakerCodes.has(speaker.code))
}

export async function filterSlotsReachableFromConfirmedSubmissions(
  slots: Slot[],
  event: H3Event,
): Promise<Slot[]> {
  const submissions = await fetchConfirmedSubmissions(event)
  const submissionCodes = new Set(submissions.map((submission) => submission.code))

  return slots.filter((slot) => submissionCodes.has(slot.submission))
}

export async function filterAnswersReachableFromConfirmedSubmissions(
  answers: Answer[],
  event: H3Event,
): Promise<Answer[]> {
  const submissions = await fetchConfirmedSubmissions(event)
  const answerIds = new Set(submissions.flatMap((submission) => submission.answers))
  const speakerCodes = new Set(submissions.flatMap((submission) => submission.speakers))

  const speakers = await fetchPretalxTable(event, 'speakers', SpeakerSchema)
  speakers
    .filter((speaker) => speakerCodes.has(speaker.code))
    .flatMap((speaker) => speaker.answers)
    .forEach((answerId) => answerIds.add(answerId))

  return answers.filter((answer) => answerIds.has(answer.id))
}
