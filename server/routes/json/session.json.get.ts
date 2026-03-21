import { pretalxToOpass } from '~~/server/utils/opass/pretalxToOpass'
import pretalxData from '~~/server/utils/pretalx'

export default defineEventHandler(async () => {
  const data = await pretalxData()

  if (!data) {
    return (await $fetch('https://coscup.org/2026/json/session.json'))
  }

  return pretalxToOpass(data)
})
