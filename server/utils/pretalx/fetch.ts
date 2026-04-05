import type { PretalxData, PretalxResponse, PretalxTable, TableTypeMap } from '#shared/types/pretalx'
import { PRETALX_TABLE_SCHEMAS } from '#shared/types/pretalx'
import z from 'zod'

function parsePretalxResponse<T extends PretalxTable>(
  table: T,
  input: unknown,
): PretalxResponse<T> {
  return z.object({
    count: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(PRETALX_TABLE_SCHEMAS[table]),
  }).parse(input) as PretalxResponse<T>
}

function getPretalxItemKey<T extends PretalxTable>(item: TableTypeMap[T]): string | number {
  if ('code' in item) {
    return item.code
  }

  return item.id
}

export async function fetchPretalxTable<T extends PretalxTable>(
  table: T,
): Promise<PretalxData<T>> {
  const { pretalxApiUrl, pretalxApiToken } = useRuntimeConfig()

  if (!pretalxApiUrl || !pretalxApiToken) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing NUXT_PRETALX_API_URL or NUXT_PRETALX_API_TOKEN environment variable',
    })
  }

  const data: PretalxData<T> = { arr: [], map: {} }
  let url: string | null = table

  while (url) {
    const response: PretalxResponse<T> = parsePretalxResponse(
      table,
      await $fetch(
        url,
        {
          baseURL: pretalxApiUrl,
          headers: {
            Authorization: `Token ${pretalxApiToken}`,
          },
        },
      ),
    )

    data.arr.push(...response.results)
    Object.assign(
      data.map,
      Object.fromEntries(response.results.map((item) => [getPretalxItemKey(item), item])),
    )
    url = response.next
  }

  return data
}
