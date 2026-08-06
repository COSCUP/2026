import { z } from 'zod'
import { PretalxLocaleSchema } from './pretalx'

const SessionSpeakerContentSchema = z.object({
  name: z.string(),
  bio: z.string(),
})

export const SessionSpeakerSchema = z.object({
  id: z.string(),
  avatar: z.string().nullable(),
  zh: SessionSpeakerContentSchema,
  en: SessionSpeakerContentSchema,
})

const SessionContentSchema = z.object({
  title: z.string(),
  describe: z.string(),
  type: z.string(),
})

export const SessionDifficultySchema = z.enum([
  'Elementary',
  'Intermediate',
  'Advanced',
  'Professional',
])

export const SessionTrackSchema = z.object({
  id: z.number(),
  name: PretalxLocaleSchema,
})

export const SessionSummarySchema = z.object({
  id: z.string(),
  room: PretalxLocaleSchema.optional(),
  start: z.string().nullable().optional(),
  end: z.string().nullable().optional(),
  language: z.string().optional(),
  track: SessionTrackSchema.optional(),
  speakers: z.array(SessionSpeakerSchema),
  zh: SessionContentSchema,
  en: SessionContentSchema,
  tags: z.array(z.string()),
  uri: z.string(),
})

export const SessionDetailSchema = SessionSummarySchema.extend({
  trackColor: z.string(),
  co_write: z.string().nullable(),
  qa: z.string().nullable(),
  slide: z.string().nullable(),
  record: z.string().nullable(),
})

export const TrackSummarySchema = z.object({
  id: z.number(),
  name: PretalxLocaleSchema,
  // 該議程軌的場次數量。
  count: z.number(),
})

export const TrackSponsorSchema = z.object({
  id: z.string(),
  name: z.object({ zh: z.string(), en: z.string() }),
  link: z.string(),
  image: z.string(),
})

export const TrackDetailSchema = z.object({
  id: z.number(),
  name: PretalxLocaleSchema,
  description: PretalxLocaleSchema,
  // 該議程軌的場次，依日期（YYYY-MM-DD）分組。
  sessions: z.record(z.string(), z.array(SessionSummarySchema)),
  // 該議程軌卡片的顏色，依日期（YYYY-MM-DD）對應，與議程表使用同一組配色。
  colors: z.record(z.string(), z.string()),
  // 贊助該議程軌的夥伴。
  sponsors: z.array(TrackSponsorSchema),
})

// 該資訊來源自 Google Sheet 的「議程資訊」工作表，並非 Pretalx API。
export const SessionInfoSchema = z.object({
  id: z.string(),
  record: z.string().nullable().optional(),
  co_write: z.string().nullable().optional(),
  slide: z.string().nullable().optional(),
  qa: z.string().nullable().optional(),
})

export type SessionSpeaker = z.infer<typeof SessionSpeakerSchema>
export type SessionDifficulty = z.infer<typeof SessionDifficultySchema>
export type SessionTrack = z.infer<typeof SessionTrackSchema>
export type SessionSummary = z.infer<typeof SessionSummarySchema>
export type SessionDetail = z.infer<typeof SessionDetailSchema>
export type TrackSummary = z.infer<typeof TrackSummarySchema>
export type TrackDetail = z.infer<typeof TrackDetailSchema>
