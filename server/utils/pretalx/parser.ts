import type { IAnswer, IPretalxResult, ISlot, ISubmissionType } from './type'

const QUESTION_MAP: Record<string, number | null> = {
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
} as const

export function parseAnswer(answers: IAnswer['id'][], pretalxData: IPretalxResult): any {
  const answerMap = pretalxData.answers.map
  const results: Record<keyof typeof QUESTION_MAP, unknown> = {}

  const questionMap = answers.reduce((acc: Record<IAnswer['id'], IAnswer>, cur: IAnswer['id']) => {
    const ans = answerMap[cur]

    if (!ans) {
      console.warn('answer not found', cur)
      return acc
    }

    acc[ans.question] = ans
    return acc
  }, {})

  for (const question in QUESTION_MAP) {
    const questionId = QUESTION_MAP[question]

    if (!questionId) {
      continue
    }

    results[questionId] = questionMap[questionId]?.answer
  }

  return results
}

export function parseSlot(slotId: ISlot['id'], pretalxData: IPretalxResult) {
  const slotMap = pretalxData.slots.map
  const roomMap = pretalxData.rooms.map

  const slot = slotMap[slotId]

  if (!slot) {
    console.warn('slot not found', slotId)
    return {}
  }

  const roomId = slot.room
  slot.room = roomMap[roomId]

  return slot
}

export function parseSpeaker(speakerIds: ISubmission['speakers'], pretalxData: IPretalxResult) {
  const speakerMap = pretalxData.speakers.map

  return speakerIds.map((speakerId: string) => {
    const speaker = speakerMap[speakerId]
    const answer = parseAnswer(speaker.answers, pretalxData)

    return {
      id: speaker.code,
      avatar: speaker.avatar_url,
      zh: {
        name: answer.enName || speaker.name,
        bio: answer.enBio || speaker.biography,
      },
      en: {
        name: answer.zhName || speaker.name,
        bio: answer.zhBio || speaker.biography,
      },
    }
  })
}

export function parseType(typeId: ISubmissionType['id'], pretalxData: IPretalxResult) {
  const typeMap = pretalxData['submission-types'].map
  return typeMap[typeId]
}
