import { z } from 'zod'

export const PRETALX_TABLES = [
  'submissions',
  'submission-types',
  'speakers',
  'rooms',
  'answers',
  'slots',
] as const
export const PretalxTableSchema = z.enum(PRETALX_TABLES)

export const PretalxLocaleSchema = z.object({
  'en': z.string().optional().default(''),
  'zh-hans': z.string().optional().default(''),
})

export const SubmissionSchema = z.object({
  code: z.string(),
  title: z.string(),
  speakers: z.array(z.string()),
  submission_type: z.number(),
  track: z.number().nullable().optional(),
  tags: z.array(z.string()),
  state: z.string(),
  abstract: z.string().nullable().transform((value) => value ?? ''),
  slots: z.array(z.number()),
  answers: z.array(z.number()),
})

export const SubmissionTypeSchema = z.object({
  id: z.number(),
  name: PretalxLocaleSchema,
})

export const SpeakerSchema = z.object({
  code: z.string(),
  name: z.string(),
  biography: z.string().nullable().transform((value) => value ?? ''),
  answers: z.array(z.number()),
  avatar_url: z.string().nullable(),
})

export const RoomSchema = z.object({
  id: z.number(),
  name: PretalxLocaleSchema,
  description: PretalxLocaleSchema,
})

const AnswerValueSchema = z
  .union([
    z.string(),
    z.number(),
    z.boolean(),
    z.array(z.string()),
    z.array(z.number()),
    z.null(),
  ])
  .transform((value) => {
    if (value === null) {
      return ''
    }

    if (Array.isArray(value)) {
      return value.join(', ')
    }

    return String(value)
  })

export const AnswerSchema = z.object({
  id: z.number(),
  question: z.number(),
  answer: AnswerValueSchema,
})

export const SlotSchema = z.object({
  id: z.number(),
  room: z.number().transform((value) => value),
  start: z.string().nullable().transform((value) => value ?? undefined),
  end: z.string().nullable().transform((value) => value ?? undefined),
  duration: z.number(),
})

export const PRETALX_TABLE_SCHEMAS = {
  'submissions': SubmissionSchema,
  'submission-types': SubmissionTypeSchema,
  'speakers': SpeakerSchema,
  'rooms': RoomSchema,
  'answers': AnswerSchema,
  'slots': SlotSchema,
} as const

export type PretalxTable = z.infer<typeof PretalxTableSchema>
export type PretalxLocale = z.infer<typeof PretalxLocaleSchema>
export type Submission = z.infer<typeof SubmissionSchema>
export type SubmissionType = z.infer<typeof SubmissionTypeSchema>
export type Speaker = z.infer<typeof SpeakerSchema>
export type Room = z.infer<typeof RoomSchema>
export type Answer = z.infer<typeof AnswerSchema>
export type Slot = z.infer<typeof SlotSchema>
export type TableTypeMap = {
  [K in PretalxTable]: z.infer<(typeof PRETALX_TABLE_SCHEMAS)[K]>
}

export interface PretalxResponse<T extends PretalxTable> {
  count: number
  next: string | null
  previous: string | null
  results: TableTypeMap[T][]
}

export interface PretalxData<T extends PretalxTable> {
  arr: TableTypeMap[T][]
  map: Record<string, TableTypeMap[T]>
}

export type PretalxResult = {
  [K in PretalxTable]: PretalxData<K>
}
