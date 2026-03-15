import type { PretalxResult, Room, Speaker, Submission, SubmissionType } from '~~/server/utils/pretalx/type'
import { parseAnswer, parseSlot } from '~~/server/utils/pretalx/parser'

export function pretalxToOpass(pretalxData: PretalxResult) {
  const speakerIds: Set<Speaker['code']> = new Set()
  const roomIds: Set<Room['id']> = new Set()
  const typeIds: Set<SubmissionType['id']> = new Set()

  const sessions = pretalxData.submissions.arr
    .filter((submission: Submission) => submission.state === 'confirmed')
    .map((submission: Submission) => {
      const answer = parseAnswer(submission.answers, pretalxData)
      const slot = parseSlot(submission.slots[0]!, pretalxData)

      submission.speakers.forEach((id) => speakerIds.add(id))
      roomIds.add(slot.room?.id)
      typeIds.add(submission.submission_type)

      return {
        id: submission.code,
        type: submission.submission_type,
        room: slot.room?.id,
        start: slot.start,
        end: slot.end,
        language: answer.language,
        speakers: submission.speakers,
        zh: {
          title: submission.title,
          describe: submission.abstract,
        },
        en: {
          title: answer.enTitle || submission.title,
          describe: answer.enDesc || submission.abstract,
        },
        tags: [],
        uri: `https://coscup.org/2026/session/${submission.code}`,
        co_write: null,
        qa: null,
        slide: null,
        record: null,
      }
    })

  const speakers = Array.from(speakerIds).map((id: Speaker['code']) => {
    const speaker = pretalxData.speakers.map[id]
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

  const types = Array.from(typeIds).map((id: SubmissionType['id']) => {
    const type = pretalxData['submission-types'].map[id]
    return {
      id: type.id,
      zh: {
        name: type.name['zh-hans'] || type.name.en,
      },
      en: {
        name: type.name.en || type.name['zh-hans'],
      },
    }
  })

  const rooms = Array.from(roomIds)
    .filter(Boolean)
    .map((id: Room['id']) => {
      const room = pretalxData.rooms.map[id]
      return {
        id: room.id,
        zh: {
          name: room.name['zh-hans'] || room.name.en,
        },
        en: {
          name: room.name.en || room.name['zh-hans'],
        },
      }
    })

  // TODO: tags

  return { sessions, speakers, session_types: types, rooms }
}
