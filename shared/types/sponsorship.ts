import { z } from 'zod'

export const TierLevelSchema = z.enum([
  'titanium', // 鈦金級
  'diamond', // 鑽石級
  'gold', // 黃金級
  'silver', // 白銀級
  'bronze', // 青銅級
  'friend', // 好朋友級
])
export type TierLevel = z.infer<typeof TierLevelSchema>

const MethodSchema = z.enum([
  'amount', // 贊助金額
  'requirement', // 贊助方式
])

// sponsorshipTiers sheet
export const SponsorshipTierSchema = z.object({
  level: TierLevelSchema.or(z.literal('community')),
  method: MethodSchema,
  value_zh: z.string(),
  value_en: z.string(),
  benefits_zh: z.string(),
  benefits_en: z.string(),
})
export type SponsorshipTier = z.infer<typeof SponsorshipTierSchema>

// sponsorshipAddOnsZh & sponsorshipAddOnsEn sheets
export const SponsorshipAddOnSchema = z.object({
  item: z.string(),
  tooltip: z.string(),
  titanium_amount: z.string(),
  diamond_amount: z.string(),
  gold_amount: z.string(),
  silver_amount: z.string(),
  bronze_amount: z.string(),
  friend_amount: z.string(),
})
export type SponsorshipAddOn = z.infer<typeof SponsorshipAddOnSchema>
