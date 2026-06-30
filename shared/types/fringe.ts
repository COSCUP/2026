import { z } from 'zod'

export const FringeRowSchema = z.object({
  id: z.string(),
  title_zh: z.string(),
  title_en: z.string(),
  intro_zh: z.string(),
  intro_en: z.string(),
  link: z.string(),
  contact: z.string(),
  contact_email: z.string(),
  logo: z.string(),
  publish: z.string().transform((val) => val.trim().toLowerCase() === 'true'),
})
export type FringeRow = z.infer<typeof FringeRowSchema>

export const FringeSchema = z.object({
  id: z.string(),
  title: z.object({
    zh: z.string(),
    en: z.string(),
  }),
  intro: z.object({
    zh: z.string(),
    en: z.string(),
  }),
  link: z.string(),
  logo: z.string(),
})
export type Fringe = z.infer<typeof FringeSchema>
