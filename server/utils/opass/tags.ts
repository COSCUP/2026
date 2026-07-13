import type { OpassNamedEntity } from './types'
import { parseDifficulty } from '#server/utils/pretalx/parser'

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

function buildTag(id: string, key: string): OpassNamedEntity {
  const name = TAG_NAMES[key]!
  return { id, zh: { name: name.zh }, en: { name: name.en } }
}

// 由語言與難度算出議程的 tag 字典項目（含 slug id 與多語名稱）。
export function sessionTags(language: string | undefined, difficultyRaw: string | undefined): OpassNamedEntity[] {
  const tags: OpassNamedEntity[] = []

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
