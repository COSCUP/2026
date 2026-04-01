import type { PretalxData, PretalxResponse, PretalxResult } from './type'

export default defineCachedFunction(
  async () => {
    const { pretalxApiUrl, pretalxApiToken } = useRuntimeConfig()
    if (!pretalxApiUrl || !pretalxApiToken) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Missing NUXT_PRETALX_API_URL or NUXT_PRETALX_API_TOKEN environment variable',
      })
    }

    const tables = ['submissions', 'submission-types', 'speakers', 'rooms', 'answers', 'slots'] as const
    const results: Partial<PretalxResult> = {}

    for (const table of tables) {
      let url: string = table
      results[table] = { arr: [], map: {} } satisfies PretalxData<typeof table>

      while (url) {
        const response = await $fetch<PretalxResponse<typeof table>>(
          url,
          {
            baseURL: pretalxApiUrl,
            headers: {
              Authorization: `Token ${pretalxApiToken}`,
            },
          },
        )

        results[table].arr.push(...response.results)
        Object.assign(results[table].map, Object.fromEntries(response.results.map((item: any) => [item.id || item.code, item])))
        url = response.next
      }
    }

    return results as PretalxResult
  },
  {
    maxAge: Infinity,
    name: 'pretalxData',
  },
)
