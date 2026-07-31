import { pretalxToOpass } from '#server/utils/opass/pretalxToOpass'
import { sessions as pretalxData } from '#server/utils/pretalx'

export default defineEventHandler(async () => {
  const data = await pretalxData()
  const opass = pretalxToOpass(data)

  return opass
})
