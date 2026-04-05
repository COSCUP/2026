import type { PretalxResult } from '#shared/types/pretalx'

import { fetchPretalxTable } from './fetch'

export default defineCachedFunction(
  async () => {
    const { pretalxApiUrl, pretalxApiToken } = useRuntimeConfig()
    if (!pretalxApiUrl || !pretalxApiToken) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Missing NUXT_PRETALX_API_URL or NUXT_PRETALX_API_TOKEN environment variable',
      })
    }

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
  },
  {
    maxAge: Infinity,
    name: 'pretalxData',
  },
)
