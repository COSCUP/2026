import type { Ad } from '#shared/types/ad'
import { selfHostedImageUrl } from '#server/utils/remoteImages'
import { fetchSheet } from '../utils/sheets'

export default defineEventHandler(async (): Promise<Ad[]> => {
  const adRows = await fetchSheet('ad')
  const ads = import.meta.dev ? adRows : adRows.filter(({ publish }) => publish)

  return ads.map(({ newsId, 'image:vertical': imageVertical, 'image:horizontal': imageHorizontal, link, weight }) => ({
    id: newsId,
    imageVertical: selfHostedImageUrl(imageVertical),
    imageHorizontal: selfHostedImageUrl(imageHorizontal),
    link,
    weight,
  }))
})
