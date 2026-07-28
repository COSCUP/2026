// 議程軌的補充資料。
//
// Pretalx 的 track 只有 name 與 description 兩個欄位，
// 但議程軌詳細頁還需要「概要、社群連結、公告」等社群自訂內容。
// 這些資料目前沒有上游來源，因此先在這裡以 track id 為索引手動維護，
// 頁面在欄位缺漏時會優雅地隱藏對應區塊。

export interface LocalizedText {
  zh: string
  en: string
}

export interface TrackLink {
  /** 連結文字（雙語） */
  label: LocalizedText
  /** 連結網址 */
  url: string
}

export interface TrackMeta {
  /** 議程軌概要，顯示於標題下方的一行簡介 */
  subtitle?: LocalizedText
  /** 議程結束後活動等公告，顯示於描述上方的告示框 */
  announcement?: LocalizedText
  /** 社群連結，如官方網站、Facebook 社群 */
  links?: TrackLink[]
}

// key 為 Pretalx track id。
export const trackMeta: Record<number, TrackMeta> = {
  // 範例（待填入真實資料）：
  // 123: {
  //   subtitle: {
  //     zh: 'Java Virtual Machine 開發者在台灣的交流基地',
  //     en: 'A hub for JVM developers in Taiwan',
  //   },
  //   announcement: {
  //     zh: '議程結束後將舉辦 Open Space 討論，歡迎帶著你的技術問題一起交流！',
  //     en: 'An Open Space discussion will be held after the sessions. Bring your technical questions!',
  //   },
  //   links: [
  //     { label: { zh: '官方網站', en: 'Website' }, url: 'https://example.org' },
  //     { label: { zh: 'Facebook 社群', en: 'Facebook' }, url: 'https://facebook.com/example' },
  //   ],
  // },
}

export function getTrackMeta(id: number): TrackMeta {
  return trackMeta[id] ?? {}
}
