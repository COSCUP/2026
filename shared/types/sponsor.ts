import { z } from 'zod'
import { TIER_LEVELS } from '#shared/types/sponsorship'

export const SPONSOR_LEVELS = [
  ...TIER_LEVELS,
  'community',
  'thanks',
  'co-host',
  'co-organizer',
] as const

export const SponsorLevelSchema = z.enum(SPONSOR_LEVELS)

const RewardTypeSchema = z.enum(['Null', '累計贊助', '連續贊助', '累計合作']).default('Null').catch('Null')
const RewardDataSchema = z.coerce.number().int().nonnegative().default(0).catch(0)

export const SponsorListRowSchema = z.object({
  id: z.string(),
  level: SponsorLevelSchema,
  name_en: z.string(),
  name_zh: z.string(),
  intro_en: z.string(),
  intro_zh: z.string(),
  link: z.string(),
  image: z.string(),
  publish: z.string().transform((val) => val.toLowerCase() === 'true'),
  reward_type: RewardTypeSchema,
  reward_data: RewardDataSchema,
  track: z.string().default(''),
})

export const SponsorTrackSchema = z.object({
  id: z.number(),
  name: z.record(z.string(), z.string()),
}).nullable()

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
  reward_type: RewardTypeSchema,
  reward_data: RewardDataSchema,
  track: SponsorTrackSchema.default(null),
})

export type SponsorListRow = z.infer<typeof SponsorListRowSchema>
export type Sponsor = z.infer<typeof SponsorSchema>
export type SponsorLevel = z.infer<typeof SponsorLevelSchema>
export type RewardType = z.infer<typeof RewardTypeSchema>
