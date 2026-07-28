import type * as z from 'zod'
import { AdRowSchema } from './ad'
import { SponsorListRowSchema } from './sponsor'
import { SponsorshipAddOnSchema, SponsorshipTierSchema } from './sponsorship'
import { StaffRowSchema } from './staff'

export type SheetID = typeof SHEET_IDS[number]

export const SHEET_IDS = Object.freeze(['sponsorship-tiers', 'sponsorship-add-ons-zh', 'sponsorship-add-ons-en', 'sponsor-list', 'staff', 'ad'] as const)
export const SHEET_NAMES = Object.freeze({
  'sponsorship-tiers': '贊助方案',
  'sponsorship-add-ons-zh': '贊助方案加價購（中文）',
  'sponsorship-add-ons-en': '贊助方案加價購（英文）',
  'sponsor-list': '贊助列表',
  'staff': '工作夥伴',
  'ad': '廣告',
} satisfies Record<SheetID, string>)
export const SHEET_SCHEMAS = Object.freeze({
  'sponsorship-tiers': SponsorshipTierSchema,
  'sponsorship-add-ons-zh': SponsorshipAddOnSchema,
  'sponsorship-add-ons-en': SponsorshipAddOnSchema,
  'sponsor-list': SponsorListRowSchema,
  'staff': StaffRowSchema,
  'ad': AdRowSchema,
} satisfies Record<SheetID, z.Schema>)
