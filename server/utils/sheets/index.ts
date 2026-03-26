import { SponsorshipAddOnSchema, SponsorshipTierSchema } from '#shared/types/sponsorship'

export const SHEETS = {
  sponsorshipTiers: { name: '贊助方案', schema: SponsorshipTierSchema },
  sponsorshipAddOnsZh: { name: '贊助方案加價購（中文）', schema: SponsorshipAddOnSchema },
  sponsorshipAddOnsEn: { name: '贊助方案加價購（英文）', schema: SponsorshipAddOnSchema },
}
