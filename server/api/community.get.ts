import type { CommunityRow } from '#shared/types/community'
import type { Submission } from '#shared/types/pretalx'
import { communities as pretalxData } from '#server/utils/pretalx'
import { parseAnswer } from '#server/utils/pretalx/parser'

export default defineEventHandler(async () => {
  const [data, sheetRows] = await Promise.all([
    pretalxData(),
    $fetch<CommunityRow[]>('/api/sheets/community'),
  ])

  const sheetMap = new Map(sheetRows.map((row) => [row.id, row]))

  const merged = new Map<string, {
    id: string
    logo?: string
    url?: string
    booth: string
    track: string
    zh: { name: string, description: string }
    en: { name: string, description: string }
  }>()

  data.submissions.arr
    .filter((submission: Submission) => submission.state === 'confirmed' || submission.state === 'accepted')
    .forEach((submission: Submission) => {
      const answers = parseAnswer(submission.answers, 'community', data)
      const enName = answers.enName || submission.title

      if (merged.has(enName)) {
        return
      }

      const sheet = sheetMap.get(submission.code)
      merged.set(enName, {
        id: submission.code,
        logo: answers.logo,
        url: answers.url,
        booth: sheet?.booth ?? '',
        track: sheet?.track ?? '',
        zh: {
          name: answers.zhName || answers.enName || '',
          description: answers.zhDesc || answers.enDesc || '',
        },
        en: {
          name: answers.enName || answers.zhName || '',
          description: answers.enDesc || answers.zhDesc || '',
        },
      })
    })

  return [...merged.values()]
})
