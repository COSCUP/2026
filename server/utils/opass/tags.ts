import { parseDifficulty } from '#server/utils/pretalx/parser'

// OPass app 的 tag 分類沿用 2025：議程以 slug id 參照 tag，
// 而頂層 `tags` 字典提供每個 slug 的多語名稱。分類僅含語言與難度，
// 不含 pretalx 自訂標籤。

export interface OpassTag {
  id: string
  zh: { name: string }
  en: { name: string }
}

// 投稿語言原始字串 → 通用語言鍵（沿用 2025）。
const LANGUAGE_GENERALIZE_MAP: Record<string, string> = {
  中文: 'zh-tw',
  漢語: 'zh-tw',
  Chinese: 'zh-tw',
  Mandarin: 'zh-tw',
  中国語: 'zh-tw',
  英文: 'en',
  English: 'en',
  英語: 'en',
  Japanese: 'ja-JP',
  日本語: 'ja-JP',
  台語: 'taiwanese',
  Taiwanese: 'taiwanese',
  其他: 'others',
  Others: 'others',
  その他: 'others',
}

// 各通用鍵（語言 + 難度）的多語顯示名稱（沿用 2025 tagTranslations）。
const TAG_NAMES: Record<string, { zh: string, en: string }> = {
  'zh-tw': { zh: '漢語', en: 'Mandarin' },
  'en': { zh: '英語', en: 'English' },
  'ja-JP': { zh: '日本語', en: '日本語' },
  'taiwanese': { zh: '台語', en: '台語' },
  'others': { zh: '其他', en: '其他' },
  'Elementary': { zh: '入門', en: 'Elementary' },
  'Intermediate': { zh: '中階', en: 'Intermediate' },
  'Advanced': { zh: '進階', en: 'Advanced' },
  'Professional': { zh: '專業', en: 'Professional' },
}

function buildTag(id: string, key: string): OpassTag {
  const name = TAG_NAMES[key]!
  return { id, zh: { name: name.zh }, en: { name: name.en } }
}

// 由語言與難度算出議程的 tag 字典項目（含 slug id 與多語名稱）。
export function sessionTags(language: string | undefined, difficultyRaw: string | undefined): OpassTag[] {
  const tags: OpassTag[] = []

  const lang = language ? LANGUAGE_GENERALIZE_MAP[language] : undefined
  if (lang) {
    tags.push(buildTag(`language_${lang.toLowerCase().replace(/-/g, '')}`, lang))
  }

  const diff = parseDifficulty(difficultyRaw)
  if (diff) {
    tags.push(buildTag(`difficulty_${diff.toLowerCase()}`, diff))
  }

  return tags
}
