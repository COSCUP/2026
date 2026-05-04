import type { PretalxData } from '#shared/types/pretalx'

function pretalxFetchOptions(): { baseURL?: string } {
  const { pretalxApiToken, pretalxApiUrl, coscupBaseUrl } = useRuntimeConfig()
  if (pretalxApiToken && pretalxApiUrl) {
    return {}
  }
  if (!coscupBaseUrl) {
    throw createError({
      statusCode: 500,
      message: 'Missing NUXT_PRETALX_API_URL/NUXT_PRETALX_API_TOKEN and no NUXT_COSCUP_BASE_URL fallback configured',
    })
  }
  return { baseURL: coscupBaseUrl }
}

export async function fetchSubmissions(): Promise<PretalxData<'submissions'>> {
  const arr = await $fetch('/api/pretalx/submissions', pretalxFetchOptions())
  return { arr, map: Object.fromEntries(arr.map((s) => [s.code, s])) }
}

export async function fetchSpeakers(): Promise<PretalxData<'speakers'>> {
  const arr = await $fetch('/api/pretalx/speakers', pretalxFetchOptions())
  return { arr, map: Object.fromEntries(arr.map((s) => [s.code, s])) }
}

export async function fetchSubmissionTypes(): Promise<PretalxData<'submission-types'>> {
  const arr = await $fetch('/api/pretalx/submission-types', pretalxFetchOptions())
  return { arr, map: Object.fromEntries(arr.map((t) => [t.id, t])) }
}

export async function fetchRooms(): Promise<PretalxData<'rooms'>> {
  const arr = await $fetch('/api/pretalx/rooms', pretalxFetchOptions())
  return { arr, map: Object.fromEntries(arr.map((r) => [r.id, r])) }
}

export async function fetchAnswers(): Promise<PretalxData<'answers'>> {
  const arr = await $fetch('/api/pretalx/answers', pretalxFetchOptions())
  return { arr, map: Object.fromEntries(arr.map((a) => [a.id, a])) }
}

export async function fetchSlots(): Promise<PretalxData<'slots'>> {
  const arr = await $fetch('/api/pretalx/slots', pretalxFetchOptions())
  return { arr, map: Object.fromEntries(arr.map((s) => [s.id, s])) }
}
