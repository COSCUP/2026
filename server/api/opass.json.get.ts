import { pretalxToOpass } from '#server/utils/opass/pretalxToOpass'
import { sessions as pretalxData } from '#server/utils/pretalx'
import { fetchSheet } from '#server/utils/sheets'

export default defineEventHandler(async () => {
  const [data, sessionInfoRows] = await Promise.all([
    pretalxData(),
    fetchSheet('session-info'),
  ])
  const sessionInfoMap = new Map(sessionInfoRows.map((row) => [row.id, row]))
  const opass = pretalxToOpass(data, sessionInfoMap)

  return opass
})
