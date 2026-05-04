import type { SheetID } from '#shared/types/sheets'
import { z } from 'zod'
import { SHEET_SCHEMAS } from '#shared/types/sheets'

type SheetResult<K extends SheetID> = z.infer<(typeof SHEET_SCHEMAS)[K]>

export async function fetchSheet<K extends SheetID>(
  sheetID: K,
): Promise<SheetResult<K>[]> {
  const records = await $fetch(`/api/sheets/${sheetID}`)
  const recordsSchema = z.array(SHEET_SCHEMAS[sheetID])

  return recordsSchema.parse(records)
}
