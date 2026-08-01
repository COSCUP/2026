import { selfHostedImageUrl } from '#server/utils/remoteImages'
import { fetchSheet } from '../utils/sheets'

export default defineEventHandler(async () => {
  const sheets = await fetchSheet('sponsor-list')

  const sponsors = import.meta.dev
    ? sheets
    : sheets.filter(({ publish }) => publish)

  return sponsors.map(({ name_en, name_zh, intro_en, intro_zh, image, ...attr }) => ({
    ...attr,
    name: { zh: name_zh, en: name_en },
    intro: { zh: intro_zh, en: intro_en },
    image: selfHostedImageUrl(image),
  }))
})
