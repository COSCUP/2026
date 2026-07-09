import type { PretalxResult, Submission } from '#shared/types/pretalx'
import type { SessionSummary } from '#shared/types/session'
import { parseAnswer, parseDifficulty, parseSlot, parseSpeaker, parseTags, parseTrack, parseType } from './parser'

// 將單一 pretalx submission 轉換成 SessionSummary。
// 若 submission 沒有有效的時段（slot/start/end/room），回傳 null。
export function buildSessionSummary(submission: Submission, data: PretalxResult): SessionSummary | null {
  if (!submission.slots[0]) {
    return null
  }

  const answers = parseAnswer(submission.answers, data)
  const slot = parseSlot(submission.slots[0], data)
  const speakers = parseSpeaker(submission.speakers, data)
  const type = parseType(submission.submission_type, data)

  if (!slot || !slot.start || !slot.end || !slot.room) {
    return null
  }

  return {
    id: submission.code,
    room: slot.room.name,
    start: slot.start,
    end: slot.end,
    language: answers.language,
    track: parseTrack(submission.track, data),
    speakers,
    zh: {
      title: submission.title,
      describe: submission.abstract,
      type: type.name['zh-hant'] || type.name.en,
    },
    en: {
      title: answers.enTitle || submission.title,
      describe: answers.enDesc || submission.abstract,
      type: type.name.en || type.name['zh-hant'],
    },
    tags: parseTags(submission.tags, data, parseDifficulty(answers.difficulty)),
    uri: `https://coscup.org/2026/session/${submission.code}`,
  }
}

// 依開始日期（YYYY-MM-DD）將 session 分組。
export function groupSessionsByDay(sessions: SessionSummary[]): Record<string, SessionSummary[]> {
  return sessions.reduce((acc, session) => {
    const day = session.start!.slice(0, 10)
    if (!acc[day]) {
      acc[day] = []
    }
    acc[day].push(session)
    return acc
  }, {} as Record<string, SessionSummary[]>)
}
