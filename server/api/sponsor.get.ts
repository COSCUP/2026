import type { Submission } from '#shared/types/pretalx'
import { communities as pretalxCommunities, sessions as pretalxData } from '#server/utils/pretalx'
import { parseAnswer } from '#server/utils/pretalx/parser'
import { fetchSheet } from '../utils/sheets'

function transformImageUrl(source: string) {
  if (source.startsWith('https://drive.google.com/file/d/')) {
    const id = source.split('/')[5]
    const url = `https://drive.google.com/thumbnail?id=${id}`

    return url
  }

  return source
}

export default defineEventHandler(async () => {
  const [sheets, sessionData, communityData] = await Promise.all([
    fetchSheet('sponsor-list'),
    pretalxData(),
    pretalxCommunities(),
  ])

  const trackMap = new Map(
    sessionData.tracks.arr.map((track) => [String(track.id), { id: track.id, name: track.name }]),
  )

  const communityMap = new Map<string, { id: string, name: { zh: string, en: string }, logo?: string }>()
  communityData.submissions.arr
    .filter((s: Submission) => s.state === 'confirmed' || s.state === 'accepted')
    .forEach((s: Submission) => {
      const answers = parseAnswer(s.answers, 'community', communityData)
      communityMap.set(s.code, {
        id: s.code,
        name: {
          zh: answers.zhName || answers.enName || s.title,
          en: answers.enName || answers.zhName || s.title,
        },
        logo: answers.logo,
      })
    })

  const sponsors = import.meta.dev
    ? sheets
    : sheets.filter(({ publish }) => publish)

  return sponsors.map(({ name_en, name_zh, intro_en, intro_zh, image, track, community, ...attr }) => ({
    ...attr,
    name: { zh: name_zh, en: name_en },
    intro: { zh: intro_zh, en: intro_en },
    image: transformImageUrl(image),
    track: track ? trackMap.get(track) ?? null : null,
    community: community ? communityMap.get(community) ?? null : null,
  }))
})
