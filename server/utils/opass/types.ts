/**
 * Generated from https://github.com/CCIP-App/schedule-json-validator/blob/38cff3eabbde4cb6d84e3a19accf7e620a29eab7/schemas/opass-schedule.v1.schema.json
 */

import { z } from 'zod'

const idSchema = z.string().min(1)

const stringListSchema = z.array(z.string())

const localizedSessionSchema = z.looseObject({
  title: z.string(),
  description: z.string(),
})

const localizedSpeakerSchema = z.looseObject({
  name: z.string(),
  bio: z.string(),
})

const localizedNameSchema = z.looseObject({
  name: z.string(),
  description: z.string().optional(),
})

export const opassSessionSchema = z.looseObject({
  id: idSchema,
  room: idSchema,
  type: idSchema.optional(),
  start: z.iso.datetime({ offset: true }),
  end: z.iso.datetime({ offset: true }),
  zh: localizedSessionSchema,
  en: localizedSessionSchema,
  speakers: stringListSchema,
  tags: stringListSchema,
  broadcast: stringListSchema.optional(),
  uri: z.string().optional(),
  qa: z.string().optional(),
  slide: z.string().optional(),
  live: z.string().optional(),
  record: z.string().optional(),
  language: z.string().optional(),
  co_write: z.string().optional(),
})

export const opassSpeakerSchema = z.looseObject({
  id: idSchema,
  avatar: z.string(),
  zh: localizedSpeakerSchema,
  en: localizedSpeakerSchema,
})

export const opassNamedEntitySchema = z.looseObject({
  id: idSchema,
  zh: localizedNameSchema,
  en: localizedNameSchema,
})

export const opassScheduleSchema = z.looseObject({
  sessions: z.array(opassSessionSchema),
  speakers: z.array(opassSpeakerSchema),
  session_types: z.array(opassNamedEntitySchema),
  rooms: z.array(opassNamedEntitySchema),
  tags: z.array(opassNamedEntitySchema),
})

export type OpassSession = z.infer<typeof opassSessionSchema>
export type OpassSpeaker = z.infer<typeof opassSpeakerSchema>
export type OpassNamedEntity = z.infer<typeof opassNamedEntitySchema>
export type OpassSchedule = z.infer<typeof opassScheduleSchema>
