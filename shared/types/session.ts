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
  co_write: z.null(),
  qa: z.null(),
  slide: z.null(),
  record: z.null(),
})

export const TrackSummarySchema = z.object({
  id: z.number(),
  name: PretalxLocaleSchema,
  // 該議程軌的場次數量。
  count: z.number(),
})

export const TrackDetailSchema = z.object({
  id: z.number(),
  name: PretalxLocaleSchema,
  description: PretalxLocaleSchema,
  // 該議程軌的場次，依日期（YYYY-MM-DD）分組。
  sessions: z.record(z.string(), z.array(SessionSummarySchema)),
})

export type SessionSpeaker = z.infer<typeof SessionSpeakerSchema>
export type SessionDifficulty = z.infer<typeof SessionDifficultySchema>
export type SessionTrack = z.infer<typeof SessionTrackSchema>
export type SessionSummary = z.infer<typeof SessionSummarySchema>
export type SessionDetail = z.infer<typeof SessionDetailSchema>
export type TrackSummary = z.infer<typeof TrackSummarySchema>
export type TrackDetail = z.infer<typeof TrackDetailSchema>
