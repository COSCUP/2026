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

export const SessionSummarySchema = z.object({
  id: z.string(),
  room: PretalxLocaleSchema.optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  language: z.string().optional(),
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

export type SessionSpeaker = z.infer<typeof SessionSpeakerSchema>
export type SessionSummary = z.infer<typeof SessionSummarySchema>
export type SessionDetail = z.infer<typeof SessionDetailSchema>
