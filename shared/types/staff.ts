import { z } from 'zod'

export const STAFF_GROUP_NAMES = ['總召組', '行政組', '議程組', '贊助組', '交流組', '公關組', '資訊組', '設計組', '紀錄組', '財務組', '場務組', '製播組', 'UCA'] as const
export const StaffGroupNameSchema = z.enum(STAFF_GROUP_NAMES)
export type StaffGroupName = z.infer<typeof StaffGroupNameSchema>

export const STAFF_GROUP_KEYS = ['coordinator', 'secretary', 'program', 'sponsorship', 'engagement', 'pr', 'it', 'design', 'documentary', 'finance', 'service', 'production', 'UCA'] as const
export const StaffGroupKeySchema = z.enum(STAFF_GROUP_KEYS)
export type StaffGroupKey = z.infer<typeof StaffGroupKeySchema>

export const staffGroupKeyByName = {
  總召組: 'coordinator',
  行政組: 'secretary',
  議程組: 'program',
  贊助組: 'sponsorship',
  交流組: 'engagement',
  公關組: 'pr',
  資訊組: 'it',
  設計組: 'design',
  紀錄組: 'documentary',
  財務組: 'finance',
  場務組: 'service',
  製播組: 'production',
  UCA: 'UCA',
} as const satisfies Record<StaffGroupName, StaffGroupKey>

export const StaffRowSchema = z.object({
  group: StaffGroupNameSchema,
  name: z.string(),
  title: z.string(),
  hash: z.string(),
})
export type StaffRow = z.infer<typeof StaffRowSchema>

export const StaffMemberSchema = z.object({
  name: z.string(),
  hash: z.string(),
  avatar: z.string(),
})
export type StaffMember = z.infer<typeof StaffMemberSchema>

export const StaffGroupSchema = z.object({
  group: StaffGroupKeySchema,
  members: z.array(StaffMemberSchema),
})
export type StaffGroup = z.infer<typeof StaffGroupSchema>
