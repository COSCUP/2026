import type { Answer, PretalxResult, Room, Slot, Submission, SubmissionType, Tag, Track } from '#shared/types/pretalx'
import type { SessionDifficulty, SessionSpeaker, SessionTrack } from '#shared/types/session'

// 對應 pretalx 的問題 ID。
// key 為系統內使用的欄位名稱，value 為 pretalx 的 question id。
// 這個對應表會被 `parseAnswer` 使用，將 pretalx 的 answers
// 轉換為以 key 為索引的 Record 物件並回傳。
export const ANSWER_MAP = {
  session: {
    language: 380,
    languageOther: 381,
    enTitle: 377,
    enDesc: 378,
    difficulty: 379,
    zhName: null,
    enName: null,
    zhBio: null,
    enBio: null,
    coWrite: null,
    qa: null,
    slide: null,
    record: null,
  },
  community: {
    enName: 399,
    zhName: 397,
    enDesc: 400,
    zhDesc: 398,
    logo: 402,
  },
} as const satisfies Record<'session' | 'community', Record<string, number | null>>

type SessionQuestionKey = keyof typeof ANSWER_MAP['session']
type CommunityQuestionKey = keyof typeof ANSWER_MAP['community']
type ParsedAnswer = Partial<Record<SessionQuestionKey | CommunityQuestionKey, string>>
type ParsedSlot = Omit<Slot, 'room'> & { room?: Room }

// 議程難度正規化表。pretalx 的難度欄位是一個有固定選項的自訂問題答案。
const DIFFICULTY_GENERALIZE_MAP: Record<string, SessionDifficulty> = {
  初學者: 'Elementary',
  入門: 'Elementary',
  中階: 'Intermediate',
  進階: 'Advanced',
  專業: 'Professional',
  Beginner: 'Elementary',
  Elementary: 'Elementary',
  Intermediate: 'Intermediate',
  Advanced: 'Advanced',
  Professional: 'Professional',
}

export function parseAnswer(answers: Answer['id'][], map: 'session' | 'community', pretalxData: Pick<PretalxResult, 'answers'>): ParsedAnswer {
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

  for (const [question, questionId] of Object.entries(ANSWER_MAP[map]) as [SessionQuestionKey | CommunityQuestionKey, number | null][]) {
    if (!questionId) {
      continue
    }

    results[question] = questionMap[questionId]?.answer_file || questionMap[questionId]?.answer
  }

  return results
}

export function parseSlot(slotId: Slot['id'], pretalxData: PretalxResult): ParsedSlot | null {
  const slotMap = pretalxData.slots.map
  const roomMap = pretalxData.rooms.map

  const slot = slotMap[slotId]

  if (!slot) {
    console.error(`Slot not found: ${slotId}`)
    return null
  }

  const roomId = slot.room
  const room = roomId ? roomMap[roomId] : undefined

  return { ...slot, room }
}

export function parseSpeaker(speakerIds: Submission['speakers'], pretalxData: PretalxResult): SessionSpeaker[] {
  const speakerMap = pretalxData.speakers.map

  return speakerIds.map((speakerId: string) => {
    const speaker = speakerMap[speakerId]

    if (!speaker) {
      throw createError(`Speaker not found: ${speakerId}`)
    }

    const answer = parseAnswer(speaker.answers, 'session', pretalxData)

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

export function parseTrack(trackId: Submission['track'], pretalxData: PretalxResult): SessionTrack | undefined {
  if (trackId == null) {
    return undefined
  }

  const track: Track | undefined = pretalxData.tracks.map[trackId]

  if (!track) {
    return undefined
  }

  return { id: track.id, name: track.name }
}

// 解析議程標籤，並把正規化後的難度（若有）一併併入標籤清單，
// 將 appends（難度、語言等）前置於 Pretalx 公開標籤之前。
export function parseTags(tagIds: Submission['tags'], pretalxData: PretalxResult, appends: string[] = []): string[] {
  const tagMap = pretalxData.tags.map

  const tags = tagIds
    .map((tagId) => tagMap[tagId])
    .filter((tag): tag is Tag => tag !== undefined && tag.is_public)
    .map((tag) => tag.tag)

  return [...appends, ...tags]
}

// 將投稿者填寫的難度原始字串正規化成統一的英文 enum，無法對應時回傳 undefined。
export function parseDifficulty(difficulty: string | undefined): SessionDifficulty | undefined {
  if (!difficulty) {
    return undefined
  }

  return DIFFICULTY_GENERALIZE_MAP[difficulty.trim()]
}

export function parseLanguage(language: string | undefined): string | undefined {
  if (!language) {
    return undefined
  }

  const lang = language.trim().toLowerCase()

  if (lang === 'english' || lang === '英文' || lang === '英語') {
    return 'English'
  }

  if (lang === '中文' || lang === 'mandarin') {
    return 'Mandarin'
  }

  return 'others'
}
