import * as z from 'zod'
import { PRETALX_TABLES } from '#shared/types/pretalx'

const pretalxResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(z.unknown()),
})

const requestSchema = z.object({
  table: z.enum(PRETALX_TABLES),
})

export default defineCachedEventHandler(
  async (event) => {
    const { table } = await getValidatedRouterParams(event, requestSchema.parse)
    const { pretalxApiUrl, pretalxApiToken } = useRuntimeConfig()

    if (!pretalxApiUrl || !pretalxApiToken) {
      throw createError({
        statusCode: 500,
        statusMessage:
          'Missing NUXT_PRETALX_API_URL or NUXT_PRETALX_API_TOKEN environment variable',
      })
    }

    let path: string | null = table
    const results: unknown[] = []

    do {
      const newRawResponse = await $fetch(path, {
        baseURL: pretalxApiUrl,
        headers: {
          Authorization: `Token ${pretalxApiToken}`,
        },
      })

      const newResponse = pretalxResponseSchema.parse(newRawResponse)
      results.push(...newResponse.results)
      path = newResponse.next
    } while (path)

    return results
  },
  {
    maxAge: 31536000, // 1 year
    staleMaxAge: 86400, // 1 day
    swr: true,
  },
)
