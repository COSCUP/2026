import { z } from 'zod'

export const AdRowSchema = z.object({
  'sponsorId': z.string(),
  'newsId': z.string(),
  'image:vertical': z.string(),
  'image:horizontal': z.string(),
  'link': z.url({ protocol: /^https?$/ }),
  'weight': z.string().trim().transform((val) => Number(val) || 1),
  'publish': z.string().transform((val) => val.toLowerCase() === 'true'),
})

export type AdRow = z.infer<typeof AdRowSchema>

export const AdSchema = z.object({
  id: z.string(),
  imageVertical: z.string(),
  imageHorizontal: z.string(),
  link: z.url({ protocol: /^https?$/ }),
  weight: z.number(),
})

export type Ad = z.infer<typeof AdSchema>
