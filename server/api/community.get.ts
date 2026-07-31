import type { Submission } from '#shared/types/pretalx'
import { communities as pretalxData } from '#server/utils/pretalx'
import { parseAnswer } from '#server/utils/pretalx/parser'

export default defineEventHandler(async () => {
  const data = await pretalxData()

  const merged = new Map<string, {
    id: string
    tracks: { id: number, name: { 'en': string, 'zh-hant': string } }[]
    logo?: string
    zh: { name: string, description: string }
    en: { name: string, description: string }
  }>()

  data.submissions.arr
    .filter((submission: Submission) => submission.state === 'confirmed' || submission.state === 'accepted')
    .forEach((submission: Submission) => {
      const answers = parseAnswer(submission.answers, 'community', data)
      const enName = answers.enName || submission.title

      const track = submission.track != null ? data.tracks.map[submission.track] : undefined

      const existing = merged.get(enName)
      if (existing) {
        if (track) {
          existing.tracks.push({ id: track.id, name: track.name })
        }
      } else {
        merged.set(enName, {
          id: submission.code,
          tracks: track ? [{ id: track.id, name: track.name }] : [],
          logo: answers.logo,
          zh: {
            name: answers.zhName || submission.title,
            description: answers.zhDesc || submission.abstract,
          },
          en: {
            name: enName,
            description: answers.enDesc || submission.abstract,
          },
        })
      }
    })

  return [...merged.values()]
})
