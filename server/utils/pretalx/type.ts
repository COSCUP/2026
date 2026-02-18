export interface ISubmission {
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

export interface ISubmissionType {
  id: number
  name: {
    'en': string
    'zh-hans': string
  }
}

export interface ISpeaker {
  code: string
  name: string
  biography: string
  answers: number[]
}

export interface IRoom {
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

export interface IAnswer {
  id: number
  question: number
  answer: string
}

export interface ISlot {
  id: number
  room: number
  start: string
  end: string
  duration: number
}

export interface TableTypeMap {
  'submissions': ISubmission
  'submission-types': ISubmissionType
  'speakers': ISpeaker
  'rooms': IRoom
  'answers': IAnswer
  'slots': ISlot
}

export interface IPretalxResponse<T extends keyof TableTypeMap> {
  count: number
  next: string
  previous: string
  results: TableTypeMap[T][]
}

export interface IPretalxData<T extends keyof TableTypeMap> {
  arr: TableTypeMap[T][]
  map: Record<string, TableTypeMap[T]>
}

export type IPretalxResult = {
  [K in keyof TableTypeMap]: any
}
