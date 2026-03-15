export interface Submission {
  code: string
  title: string
  speakers: string[]
  submission_type: number
  track: number
  tags: string[]
  state: 'confirmed'
  abstract: string
  slots: number[]
  answers: number[]
}

export interface SubmissionType {
  id: number
  name: {
    'en': string
    'zh-hans': string
  }
}

export interface Speaker {
  code: string
  name: string
  biography: string
  answers: number[]
  avatar_url: string
}

export interface Room {
  id: number
  name: {
    'en': string
    'zh-hans': string
  }
  description: {
    'en': string
    'zh-hans': string
  }
}

export interface Answer {
  id: number
  question: number
  answer: string
}

export interface Slot {
  id: number
  room: number
  start: string
  end: string
  duration: number
}

export interface TableTypeMap {
  'submissions': Submission
  'submission-types': SubmissionType
  'speakers': Speaker
  'rooms': Room
  'answers': Answer
  'slots': Slot
}

export interface PretalxResponse<T extends keyof TableTypeMap> {
  count: number
  next: string
  previous: string
  results: TableTypeMap[T][]
}

export interface PretalxData<T extends keyof TableTypeMap> {
  arr: TableTypeMap[T][]
  map: Record<string, TableTypeMap[T]>
}

export type PretalxResult = {
  [K in keyof TableTypeMap]: any
}
