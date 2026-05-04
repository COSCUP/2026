import type { H3Event } from 'h3'
import { z } from 'zod'

function pretalxPageSchema<T>(entrySchema: z.ZodType<T>) {
  return z.object({
    count: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(entrySchema),
  })
}

export async function fetchPretalxTable<T>(
  event: H3Event,
  table: string,
  schema: z.ZodType<T>,
): Promise<T[]> {
  const { pretalxApiUrl, pretalxApiToken } = useRuntimeConfig(event)
  if (!pretalxApiUrl || !pretalxApiToken) {
    throw createError('Missing NUXT_PRETALX_API_URL or NUXT_PRETALX_API_TOKEN environment variable')
  }

  const pageSchema = pretalxPageSchema(schema)
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

  return results
}
