import type { Ad } from '#shared/types/ad'
import { fetchSheet } from '../utils/sheets'

function transformImageUrl(source: string) {
  if (source.startsWith('https://drive.google.com/file/d/')) {
    const id = source.split('/')[5]
    const url = `https://drive.google.com/thumbnail?id=${id}&&sz=w4000`

    return url
  }

  return source
}

export default defineEventHandler(async (): Promise<Ad[]> => {
  const adRows = await fetchSheet('ad')
  const ads = import.meta.dev ? adRows : adRows.filter(({ publish }) => publish)

  return ads.map(({ newsId, 'image:vertical': imageVertical, 'image:horizontal': imageHorizontal, link, weight }) => ({
    id: newsId,
    imageVertical: transformImageUrl(imageVertical),
    imageHorizontal: transformImageUrl(imageHorizontal),
    link,
    weight,
  }))
})
