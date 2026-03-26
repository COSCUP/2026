export default defineEventHandler(async () => {
  const [addOnsZh, addOnsEn] = await Promise.all([
    fetchSheet('sponsorshipAddOnsZh'),
    fetchSheet('sponsorshipAddOnsEn'),
  ])

  return { zh: addOnsZh, en: addOnsEn }
})
