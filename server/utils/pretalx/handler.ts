import { z } from 'zod'

function pretalxPageSchema<T>(entrySchema: z.ZodType<T>) {
  return z.object({
    count: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(entrySchema),
  })
}

export function definePretalxTableHandler<T>(
  table: string,
  schema: z.ZodType<T>,
  postProcess?: (items: T[]) => T[],
) {
  const pageSchema = pretalxPageSchema(schema)

  return defineCachedEventHandler(async (event) => {
    const { pretalxApiUrl, pretalxApiToken } = useRuntimeConfig(event)
    if (!pretalxApiUrl || !pretalxApiToken) {
      throw createError('Missing NUXT_PRETALX_API_URL or NUXT_PRETALX_API_TOKEN environment variable')
    }

    let path: string | null = table
    const results: T[] = []

    do {
      const raw = await $fetch(path, {
        baseURL: pretalxApiUrl,
        headers: { Authorization: `Token ${pretalxApiToken}` },
      })
      const page = pageSchema.parse(raw)
      results.push(...page.results)
      path = page.next
    } while (path)

    return postProcess ? postProcess(results) : results
  }, {
    maxAge: 31536000, // 1 year
    staleMaxAge: 86400, // 1 day
    swr: true,
  })
}
