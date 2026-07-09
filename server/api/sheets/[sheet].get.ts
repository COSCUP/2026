import { parse } from 'csv-parse/sync'
import * as z from 'zod'
import { SHEET_IDS, SHEET_NAMES } from '#shared/types/sheets'

const requestSchema = z.object({
  sheet: z.enum(SHEET_IDS),
})

export default defineCachedEventHandler(
  async (event) => {
    const { googleSheetId } = useRuntimeConfig()
    if (!googleSheetId) {
      throw createError('Missing NUXT_GOOGLE_SHEET_ID environment variable')
    }

    const { sheet } = await getValidatedRouterParams(event, requestSchema.parse)
    const name = SHEET_NAMES[sheet]

    const url = `https://docs.google.com/spreadsheets/d/${googleSheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(name)}&headers=1`
    const csv = await $fetch<string>(url, { responseType: 'text' })
    const records = parse(csv, { columns: true, skip_empty_lines: true })
    return records
  },
  {
    maxAge: 31536000, // 1 year
    staleMaxAge: 86400, // 1 day
    swr: true,
  },
)
