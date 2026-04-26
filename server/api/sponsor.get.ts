import { fetchSheet } from '../utils/sheets'

function transformImageUrl(source: string) {
  if (source.startsWith('https://drive.google.com/file/d/')) {
    const id = source.split('/')[5]
    const url = `https://drive.google.com/thumbnail?id=${id}`

    return url
  }

  return source
}

export default defineEventHandler(async () => {
  const sheets = await fetchSheet('sponsorList')

  const sponsors = import.meta.dev
    ? sheets
    : sheets.filter(({ publish }) => publish)

  return sponsors.map(({ name_en, name_zh, intro_en, intro_zh, image, ...attr }) => ({
    ...attr,
    name: { zh: name_zh, en: name_en },
    intro: { zh: intro_zh, en: intro_en },
    image: transformImageUrl(image),
  }))
})
