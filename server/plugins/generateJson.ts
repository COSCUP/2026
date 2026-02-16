import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pretalx2Opass } from '~~/server/utils/opass/pretalx2Opass'
import pretalxData from '~~/server/utils/pretalx'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('close', async () => {
    if (process.env.NODE_ENV !== 'prerender') {
      return
    }

    const data = await pretalxData()
    const opass = pretalx2Opass(data)

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
