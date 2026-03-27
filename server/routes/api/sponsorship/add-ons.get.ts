export default defineEventHandler(async () => {
  const [addOnsZh, addOnsEn] = await Promise.all([
    fetchSheet('sponsorshipAddOnsZh'),
    fetchSheet('sponsorshipAddOnsEn'),
  ])

  return addOnsZh.map((zh, index) => {
    const en = addOnsEn[index] as typeof zh

    return {
      item: { zh: zh.item, en: en.item },
      tooltip: { zh: zh.tooltip, en: en.tooltip },
      titanium_amount: { zh: zh.titanium_amount, en: en.titanium_amount },
      diamond_amount: { zh: zh.diamond_amount, en: en.diamond_amount },
      gold_amount: { zh: zh.gold_amount, en: en.gold_amount },
      silver_amount: { zh: zh.silver_amount, en: en.silver_amount },
      bronze_amount: { zh: zh.bronze_amount, en: en.bronze_amount },
      friend_amount: { zh: zh.friend_amount, en: en.friend_amount },
    }
  })
})
