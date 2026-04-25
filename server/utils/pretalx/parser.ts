import type { Answer, PretalxResult, Room, Slot, Submission, SubmissionType } from '#shared/types/pretalx'
import type { SessionSpeaker } from '#shared/types/session'

// 對應 pretalx 的問題 ID。
// key 為系統內使用的欄位名稱，value 為 pretalx 的 question id。
// 這個對應表會被 `parseAnswer` 使用，將 pretalx 的 answers
// 轉換為以 key 為索引的 Record 物件並回傳。
const QUESTION_MAP = {
  language: 269,
  languageOther: 300,
  enTitle: 257,
  enDesc: 259,
  difficulty: 270,
  zhName: 45,
  enName: 46,
  zhBio: 47,
  enBio: 48,
  coWrite: null,
  qa: null,
  slide: null,
  record: null,
} as const satisfies Record<string, number | null>

type QuestionKey = keyof typeof QUESTION_MAP
type ParsedAnswer = Partial<Record<QuestionKey, string>>
type ParsedSlot = Omit<Slot, 'room'> & { room?: Room }

export function parseAnswer(answers: Answer['id'][], pretalxData: PretalxResult): ParsedAnswer {
  const answerMap = pretalxData.answers.map
  const results: ParsedAnswer = {}

  const questionMap = answers.reduce((acc: Record<Answer['id'], Answer>, cur: Answer['id']) => {
    const ans = answerMap[cur]

    if (!ans) {
      console.warn('answer not found', cur)
      return acc
    }

    acc[ans.question] = ans
    return acc
  }, {})

  for (const question of Object.keys(QUESTION_MAP) as QuestionKey[]) {
    const questionId = QUESTION_MAP[question]

    if (!questionId) {
      continue
    }

    results[question] = questionMap[questionId]?.answer
  }

  return results
}

export function parseSlot(slotId: Slot['id'], pretalxData: PretalxResult): ParsedSlot | null {
  const slotMap = pretalxData.slots.map
  const roomMap = pretalxData.rooms.map

  const slot = slotMap[slotId]

  if (!slot) {
    throw createError(`Slot not found: ${slotId}`)
  }

  const roomId = slot.room

  if (!roomId) {
    throw createError(`Room not found for slot: ${slotId}`)
  }

  const room = roomMap[roomId]

  return { ...slot, room }
}

export function parseSpeaker(speakerIds: Submission['speakers'], pretalxData: PretalxResult): SessionSpeaker[] {
  const speakerMap = pretalxData.speakers.map

  return speakerIds.map((speakerId: string) => {
    const speaker = speakerMap[speakerId]

    if (!speaker) {
      throw createError(`Speaker not found: ${speakerId}`)
    }

    const answer = parseAnswer(speaker.answers, pretalxData)

    return {
      id: speaker.code,
      avatar: speaker.avatar_url,
      zh: {
        name: answer.zhName || speaker.name,
        bio: answer.zhBio || speaker.biography,
      },
      en: {
        name: answer.enName || speaker.name,
        bio: answer.enBio || speaker.biography,
      },
    }
  })
}

export function parseType(typeId: SubmissionType['id'], pretalxData: PretalxResult): SubmissionType {
  const typeMap = pretalxData['submission-types'].map

  if (!typeMap[typeId]) {
    throw createError(`Submission type not found: ${typeId}`)
  }

  return typeMap[typeId]
}
