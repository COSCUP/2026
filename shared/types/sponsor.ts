import { TIER_LEVELS } from '#shared/types/sponsorship'
import { z } from 'zod'

export const SPONSOR_LEVELS = [
  ...TIER_LEVELS,
  'community',
] as const

export const SponsorLevelSchema = z.enum(SPONSOR_LEVELS)

export const SponsorListRowSchema = z.object({
  id: z.string(),
  level: SponsorLevelSchema,
  name_en: z.string(),
  name_zh: z.string(),
  intro_en: z.string(),
  intro_zh: z.string(),
  link: z.string(),
  image: z.string(),
  publish: z.string(),
})

export const SponsorSchema = z.object({
  id: z.string(),
  level: SponsorLevelSchema,
  name: z.object({
    zh: z.string(),
    en: z.string(),
  }),
  intro: z.object({
    zh: z.string(),
    en: z.string(),
  }),
  link: z.string(),
  image: z.string(),
})

export type SponsorListRow = z.infer<typeof SponsorListRowSchema>
export type Sponsor = z.infer<typeof SponsorSchema>
export type SponsorLevel = z.infer<typeof SponsorLevelSchema>
