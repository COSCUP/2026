import type { H3Event } from 'h3'
import type { z } from 'zod'
import { fetchPretalxTable } from './table'

type PretalxTablePostProcess<T> = (
  items: T[],
  event: H3Event,
) => Promise<T[]> | T[]

export function definePretalxTableHandler<T>(
  table: string,
  schema: z.ZodType<T>,
  postProcess?: PretalxTablePostProcess<T>,
) {
  return defineCachedEventHandler(async (event) => {
    const results = await fetchPretalxTable(event, table, schema)
    return postProcess ? postProcess(results, event) : results
  }, {
    maxAge: 31536000, // 1 year
    staleMaxAge: 86400, // 1 day
    swr: true,
  })
}
