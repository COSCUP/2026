import type { SheetID } from '#shared/types/sheets'
import { z } from 'zod'
import { SHEET_SCHEMAS } from '#shared/types/sheets'

type SheetResult<K extends SheetID> = z.infer<(typeof SHEET_SCHEMAS)[K]>

export async function fetchSheet<K extends SheetID>(
  sheetID: K,
): Promise<SheetResult<K>[]> {
  const { googleSheetId, coscupBaseUrl } = useRuntimeConfig()
  let baseURL: string | undefined
  if (!googleSheetId) {
    if (!coscupBaseUrl) {
      throw createError({
        statusCode: 500,
        message: 'Missing NUXT_GOOGLE_SHEET_ID and no NUXT_COSCUP_BASE_URL fallback configured',
      })
    }
    baseURL = coscupBaseUrl
  }

  const records = await $fetch(`/api/sheets/${sheetID}`, baseURL !== undefined ? { baseURL } : {})
  const recordsSchema = z.array(SHEET_SCHEMAS[sheetID])

  return recordsSchema.parse(records)
}
