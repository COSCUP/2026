import { fetchSheet } from '../utils/sheets'

export default defineEventHandler(async () => {
  const sheets = await fetchSheet('sponsorList')

  const sponsors = import.meta.dev
    ? sheets
    : sheets.filter(({ publish }) => publish)

  return sponsors.map(({ name_en, name_zh, intro_en, intro_zh, ...attr }) => ({
    ...attr,
    name: { zh: name_zh, en: name_en },
    intro: { zh: intro_zh, en: intro_en },
  }))
})
