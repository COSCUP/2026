import type { PretalxData, PretalxResponse, PretalxResult } from '#shared/types/pretalx'
import { PRETALX_TABLES } from '#shared/types/pretalx'

export default defineCachedFunction(
  async () => {
    const { pretalxApiUrl, pretalxApiToken } = useRuntimeConfig()
    if (!pretalxApiUrl || !pretalxApiToken) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Missing NUXT_PRETALX_API_URL or NUXT_PRETALX_API_TOKEN environment variable',
      })
    }

    const results: Partial<PretalxResult> = {}

    for (const table of PRETALX_TABLES) {
      let url: string | null = table
      results[table] = { arr: [], map: {} } satisfies PretalxData<typeof table>

      while (url) {
        const response: PretalxResponse<typeof table> = await $fetch<PretalxResponse<typeof table>>(
          url,
          {
            baseURL: pretalxApiUrl,
            headers: {
              Authorization: `Token ${pretalxApiToken}`,
            },
          },
        )

        results[table].arr.push(...response.results as any) // TODO: any type
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
