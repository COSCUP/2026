import { transformGoogleDriveImageUrl } from '../utils/images'
import { fetchSheet } from '../utils/sheets'

export default defineEventHandler(async () => {
  const fringeRows = await fetchSheet('fringe')

  const fringes = import.meta.dev ? fringeRows : fringeRows.filter(({ publish }) => publish)

  return fringes.map(({ id, title_zh, title_en, intro_zh, intro_en, link, logo }) => ({
    id,
    title: { zh: title_zh, en: title_en },
    intro: { zh: intro_zh, en: intro_en },
    link,
    logo: transformGoogleDriveImageUrl(logo),
  }))
})
