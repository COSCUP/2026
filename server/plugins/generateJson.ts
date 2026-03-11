import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pretalxToOpass } from '~~/server/utils/opass/pretalxToOpass'
import pretalxData from '~~/server/utils/pretalx'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('close', async () => {
    if (!import.meta.prerender) {
      return
    }

    const data = await pretalxData()
    const opass = pretalxToOpass(data)

    const dirs = resolve('.output', 'public', 'json')

    if (!existsSync(dirs)) {
      mkdirSync(dirs, { recursive: true })
    }

    writeFileSync(
      resolve(dirs, 'session.json'),
      JSON.stringify(opass),
    )
  })
})
