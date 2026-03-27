export default defineEventHandler(async () => {
  const sheet = await fetchSheet('sponsorshipTiers')

  return sheet.map(({
    level,
    value_zh,
    value_en,
    benefits_zh,
    benefits_en,
  }) => ({
    level,
    value: { zh: value_zh, en: value_en },
    benefits: { zh: benefits_zh, en: benefits_en },
  }))
})
