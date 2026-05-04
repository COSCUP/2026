import type { PretalxData } from '#shared/types/pretalx'

export async function fetchSubmissions(): Promise<PretalxData<'submissions'>> {
  const arr = await $fetch('/api/pretalx/submissions')
  return { arr, map: Object.fromEntries(arr.map((s) => [s.code, s])) }
}

export async function fetchSpeakers(): Promise<PretalxData<'speakers'>> {
  const arr = await $fetch('/api/pretalx/speakers')
  return { arr, map: Object.fromEntries(arr.map((s) => [s.code, s])) }
}

export async function fetchSubmissionTypes(): Promise<PretalxData<'submission-types'>> {
  const arr = await $fetch('/api/pretalx/submission-types')
  return { arr, map: Object.fromEntries(arr.map((t) => [t.id, t])) }
}

export async function fetchRooms(): Promise<PretalxData<'rooms'>> {
  const arr = await $fetch('/api/pretalx/rooms')
  return { arr, map: Object.fromEntries(arr.map((r) => [r.id, r])) }
}

export async function fetchAnswers(): Promise<PretalxData<'answers'>> {
  const arr = await $fetch('/api/pretalx/answers')
  return { arr, map: Object.fromEntries(arr.map((a) => [a.id, a])) }
}

export async function fetchSlots(): Promise<PretalxData<'slots'>> {
  const arr = await $fetch('/api/pretalx/slots')
  return { arr, map: Object.fromEntries(arr.map((s) => [s.id, s])) }
}
