import type { PretalxResult } from '#shared/types/pretalx'

import { fetchPretalxTable } from './fetch'

export const sessions = defineCachedFunction(
  async () => {
    const { pretalxApiUrl, pretalxApiToken } = useRuntimeConfig()
    if (!pretalxApiUrl || !pretalxApiToken) {
      throw createError('Missing NUXT_PRETALX_API_URL or NUXT_PRETALX_API_TOKEN environment variable')
    }

    const [submissions, submissionTypes, speakers, rooms, answers, slots, tracks, tags] = await Promise.all([
      fetchPretalxTable('coscup-2026', 'submissions'),
      fetchPretalxTable('coscup-2026', 'submission-types'),
      fetchPretalxTable('coscup-2026', 'speakers'),
      fetchPretalxTable('coscup-2026', 'rooms'),
      fetchPretalxTable('coscup-2026', 'answers'),
      fetchPretalxTable('coscup-2026', 'slots'),
      fetchPretalxTable('coscup-2026', 'tracks'),
      fetchPretalxTable('coscup-2026', 'tags'),
    ])

    return {
      submissions,
      speakers,
      rooms,
      answers,
      slots,
      tracks,
      tags,
      'submission-types': submissionTypes,
    } satisfies PretalxResult
  },
  {
    maxAge: Infinity,
    name: 'pretalxSessionsData',
  },
)

export const communities = defineCachedFunction(
  async () => {
    const [submissions, tracks, answers] = await Promise.all([
      fetchPretalxTable('coscup-2026-call-for-participation', 'submissions'),
      fetchPretalxTable('coscup-2026-call-for-participation', 'tracks'),
      fetchPretalxTable('coscup-2026-call-for-participation', 'answers'),
    ])

    return { submissions, tracks, answers } satisfies Pick<PretalxResult, 'submissions' | 'tracks' | 'answers'>
  },
  {
    maxAge: Infinity,
    name: 'pretalxCommunitiesData',
  },
)
