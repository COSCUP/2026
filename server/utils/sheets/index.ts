import type { z } from 'zod'
import { SponsorshipAddOnSchema, SponsorshipTierSchema } from '#shared/types/sponsorship'
import { parse } from 'csv-parse/sync'

const SHEETS = {
  sponsorshipTiers: { name: '贊助方案', schema: SponsorshipTierSchema },
  sponsorshipAddOnsZh: { name: '贊助方案加價購（中文）', schema: SponsorshipAddOnSchema },
  sponsorshipAddOnsEn: { name: '贊助方案加價購（英文）', schema: SponsorshipAddOnSchema },
}

type SheetResult<K extends keyof typeof SHEETS> = z.infer<(typeof SHEETS)[K]['schema']>

export async function fetchSheet<K extends keyof typeof SHEETS>(
  sheetName: K,
): Promise<SheetResult<K>[]> {
  const { googleSheetId } = useRuntimeConfig()
  if (!googleSheetId) {
    throw createError('Missing NUXT_GOOGLE_SHEET_ID environment variable')
  }

  const sheet = SHEETS[sheetName]
  const url = `https://docs.google.com/spreadsheets/d/${googleSheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheet.name)}`
  const csv = await $fetch<string>(url, { responseType: 'text' })
  const records = parse(csv, { columns: true, skip_empty_lines: true })
  return records.map((row) => sheet.schema.parse(row)) as SheetResult<K>[]
}
