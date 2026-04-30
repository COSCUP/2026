import type { PretalxData, PretalxTable, TableTypeMap } from '#shared/types/pretalx'
import { z } from 'zod'
import { PRETALX_TABLE_SCHEMAS } from '#shared/types/pretalx'

function getPretalxItemKey<T extends PretalxTable>(item: TableTypeMap[T]): string | number {
  if ('code' in item) {
    return item.code
  }

  return item.id
}

export async function fetchPretalxTable<T extends PretalxTable>(
  table: T,
): Promise<PretalxData<T>> {
  const tableSchema = PRETALX_TABLE_SCHEMAS[table]
  if (!tableSchema) {
    throw new Error(`Unknown table: ${table}`)
  }

  const content = await $fetch(`/api/pretalx/${table}`)
  const parsed = z.array(tableSchema).parse(content) as TableTypeMap[T][]
  const map = Object.fromEntries(parsed.map((item) => [getPretalxItemKey(item), item]))

  return { arr: parsed, map }
}
