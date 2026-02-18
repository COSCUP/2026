import type { IPretalxResult, IRoom, ISubmission, ISubmissionType } from '~~/server/utils/pretalx/type'
import { parseAnswer, parseSlot } from '~~/server/utils/pretalx/parser'

export function pretalx2Opass(pretalxData: IPretalxResult) {
  const speakerIds: Set<ISpeaker['code']> = new Set()
  const roomIds: Set<IRoom['id']> = new Set()
  const typeIds: Set<ISubmissionType['id']> = new Set()

  const sessions = pretalxData.submissions.arr
    .filter((submission: ISubmission) => submission.state === 'confirmed')
    .map((submission: ISubmission) => {
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
        lanaguage: answer.language,
        speakers: submission.speakers,
        zh: {
          title: submission.title,
          describe: submission.abstract,
        },
        en: {
          title: answer.EnTitle || submission.title,
          describe: answer.EnDesc || submission.abstract,
        },
        tags: [],
        uri: `https://coscup.org/2026/session/${submission.code}`,
        co_write: null,
        qa: null,
        slide: null,
        record: null,
      }
    })

  const speakers = [...speakerIds].map((id: ISpeaker['code']) => {
    const speaker = pretalxData.speakers.map[id]
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

  const types = [...typeIds].map((id: ISubmissionType['id']) => {
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

  const rooms = [...roomIds]
    .filter(Boolean)
    .map((id: IRoom['id']) => {
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
