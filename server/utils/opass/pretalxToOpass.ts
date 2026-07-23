import type { OpassNamedEntity, OpassSchedule, OpassSession, OpassSpeaker } from '#server/utils/opass/types'
import type { PretalxResult, Room, Speaker, Submission, SubmissionType } from '#shared/types/pretalx'
import { sessionTags } from '#server/utils/opass/tags'
import { opassScheduleSchema } from '#server/utils/opass/types'
import { parseAnswer, parseSlot } from '#server/utils/pretalx/parser'

export function pretalxToOpass(pretalxData: PretalxResult): OpassSchedule {
  const speakerIds: Set<Speaker['code']> = new Set()
  const roomIds: Set<Room['id']> = new Set()
  const typeIds: Set<SubmissionType['id']> = new Set()
  const tagMap = new Map<string, OpassNamedEntity>()

  const sessions = pretalxData.submissions.arr
    .filter((submission: Submission) => submission.state === 'confirmed')
    .map((submission: Submission) => {
      const answer = parseAnswer(submission.answers, pretalxData)
      const slot = submission.slots[0] ? parseSlot(submission.slots[0]!, pretalxData) : null

      submission.speakers.forEach((id) => speakerIds.add(id))

      typeIds.add(submission.submission_type)

      if (slot?.room?.id) {
        roomIds.add(slot.room.id)
      }

      const tags = sessionTags(answer.language, answer.difficulty)
      tags.forEach((tag) => tagMap.set(tag.id, tag))

      return {
        id: submission.code,
        type: String(submission.submission_type),
        room: slot?.room?.id?.toString() ?? '',
        start: slot?.start ?? '2026-08-08T08:00:00Z',
        end: slot?.end ?? '2026-08-08T08:00:00Z',
        language: answer.language,
        speakers: submission.speakers,
        zh: {
          title: submission.title,
          description: submission.abstract,
        },
        en: {
          title: answer.enTitle || submission.title,
          description: answer.enDesc || submission.abstract,
        },
        tags: tags.map((tag) => tag.id),
        uri: `https://coscup.org/2026/session/${submission.code}`,
      } satisfies OpassSession
    })

  const speakers = Array.from(speakerIds, (id: Speaker['code']) => {
    const speaker = pretalxData.speakers.map[id]

    if (!speaker) {
      console.error(`Speaker with code ${id} not found in pretalx data.`)
      return null
    }

    const answer = parseAnswer(speaker.answers, pretalxData)

    return {
      id: speaker.code,
      avatar: speaker.avatar_url ?? 'https://placehold.co/300x300.png',
      zh: {
        name: answer.zhName || speaker.name,
        bio: answer.zhBio || speaker.biography,
      },
      en: {
        name: answer.enName || speaker.name,
        bio: answer.enBio || speaker.biography,
      },
    } satisfies OpassSpeaker
  })
    .filter((x): x is NonNullable<typeof x> => x !== null)

  const types = Array.from(typeIds, (id: SubmissionType['id']) => {
    const type = pretalxData['submission-types'].map[id]

    if (!type) {
      console.error(`Submission type with id ${id} not found in pretalx data.`)
      return null
    }

    return {
      id: String(type.id),
      zh: {
        name: type.name['zh-hant'] || type.name.en,
      },
      en: {
        name: type.name.en || type.name['zh-hant'],
      },
    } satisfies OpassNamedEntity
  })
    .filter((x): x is NonNullable<typeof x> => x !== null)

  const rooms = [...roomIds]
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .map((id: Room['id']) => {
      const room = pretalxData.rooms.map[id]

      if (!room) {
        console.error(`Room with id ${id} not found in pretalx data.`)
        return null
      }

      return {
        id: String(room.id),
        zh: {
          name: room.name['zh-hant'] || room.name.en,
        },
        en: {
          name: room.name.en || room.name['zh-hant'],
        },
      } satisfies OpassNamedEntity
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)

  // run schema check to ensure the structure is valid
  return opassScheduleSchema.parse({
    sessions,
    speakers,
    session_types: types,
    rooms,
    tags: [...tagMap.values()],
  } satisfies OpassSchedule)
}
