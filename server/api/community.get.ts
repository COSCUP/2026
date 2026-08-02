import type { Submission } from '#shared/types/pretalx'
import type { Sponsor } from '#shared/types/sponsor'
import { communities as pretalxData } from '#server/utils/pretalx'
import { parseAnswer } from '#server/utils/pretalx/parser'
import { fetchSheet } from '#server/utils/sheets'

export default defineEventHandler(async () => {
  const [data, sheetRows, allSponsors] = await Promise.all([
    pretalxData(),
    fetchSheet('community'),
    $fetch<Sponsor[]>('/api/sponsor'),
  ])

  const sponsorsByCommunity = new Map<string, { id: string, name: { zh: string, en: string }, link: string, image: string }[]>()
  for (const s of allSponsors) {
    if (s.community) {
      const list = sponsorsByCommunity.get(s.community.id) ?? []
      list.push({ id: s.id, name: s.name, link: s.link, image: s.image })
      sponsorsByCommunity.set(s.community.id, list)
    }
  }

  const sheetMap = new Map(sheetRows.map((row) => [row.id, row]))

  const merged = new Map<string, {
    id: string
    logo?: string
    url?: string
    booth: string
    track: {
      title: { zh: string, en: string }
      id: string
    }
    sponsors: { id: string, name: { zh: string, en: string }, link: string, image: string }[]
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
        track: {
          title: {
            zh: submission.title,
            en: answers.enTrack || submission.title,
          },
          id: sheet?.track ?? '',
        },
        sponsors: sponsorsByCommunity.get(submission.code) ?? [],
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
