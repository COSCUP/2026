import { createHash } from 'node:crypto'
import { copyFile, mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { parse } from 'csv-parse/sync'
import { defineNuxtModule, useLogger } from 'nuxt/kit'
import sharp from 'sharp'
import { normalizeRemoteImageUrl } from '../shared/utils/remoteImages'

type ImageManifest = Record<string, string>

const CACHE_DIR = '.cache/remote-images'
const PUBLIC_DIR = 'public/_remote-images'
const DOWNLOAD_CONCURRENCY = 6
const PRETALX_PLACEHOLDER = '/staff/nonavatar.webp'
const logger = useLogger('remote-images')

function cacheKey(url: string): string {
  return createHash('sha256').update(url).digest('hex')
}

function driveThumbnailUrl(source: string): string | null {
  const url = new URL(source)
  if (url.hostname !== 'drive.google.com') {
    return null
  }

  const id = url.searchParams.get('id')
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w4000` : null
}

function isPretalxAvatar(source: string): boolean {
  return new URL(source).hostname === 'pretalx.coscup.org'
}

async function downloadAsWebp(url: string): Promise<Buffer> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Unable to download image ${url}: ${response.status} ${response.statusText}`)
  }

  const input = Buffer.from(await response.arrayBuffer())
  if (!input.length) {
    throw new Error(`Unable to download image ${url}: response body is empty`)
  }

  return sharp(input)
    .webp({ quality: 82, effort: 4 })
    .toBuffer()
}

async function downloadImage(source: string): Promise<Buffer> {
  try {
    return await downloadAsWebp(source)
  } catch (exportError) {
    const thumbnailUrl = driveThumbnailUrl(source)
    if (!thumbnailUrl) {
      throw exportError
    }

    logger.info(`Export failed; using Drive thumbnail: ${source}`)
    try {
      return await downloadAsWebp(thumbnailUrl)
    } catch (thumbnailError) {
      throw new Error(`Unable to download image ${source} or its Drive thumbnail`, { cause: thumbnailError })
    }
  }
}

async function runWithConcurrency<T>(items: T[], worker: (item: T, index: number) => Promise<void>): Promise<void> {
  let nextIndex = 0
  await Promise.all(Array.from({ length: Math.min(DOWNLOAD_CONCURRENCY, items.length) }, async () => {
    while (nextIndex < items.length) {
      const index = nextIndex
      nextIndex += 1
      await worker(items[index]!, index)
    }
  }))
}

async function readManifest(path: string): Promise<ImageManifest> {
  try {
    return JSON.parse(await readFile(path, 'utf8')) as ImageManifest
  } catch {
    return {}
  }
}

async function getSheetImages(sheet: string, columns: string[]): Promise<string[]> {
  const sheetId = process.env.NUXT_GOOGLE_SHEET_ID
  if (!sheetId) {
    throw new Error('Missing NUXT_GOOGLE_SHEET_ID for remote image sync')
  }

  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheet)}&headers=1`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Unable to fetch ${sheet}: ${response.status} ${response.statusText}`)
  }

  const rows = parse(await response.text(), { columns: true, skip_empty_lines: true }) as Record<string, string>[]
  return rows
    .filter((row) => row.publish?.toLowerCase() === 'true')
    .flatMap((row) => columns.map((column) => row[column]))
    .filter((url): url is string => Boolean(url))
}

async function getPretalxImages(): Promise<string[]> {
  const baseURL = process.env.NUXT_PRETALX_API_URL
  const token = process.env.NUXT_PRETALX_API_TOKEN
  if (!baseURL || !token) {
    throw new Error('Missing Pretalx credentials for remote image sync')
  }

  const images: string[] = []
  let url: string | null = 'speakers'
  while (url) {
    const response = await fetch(new URL(url, baseURL), { headers: { Authorization: `Token ${token}` } })
    if (!response.ok) {
      throw new Error(`Unable to fetch Pretalx speakers: ${response.status} ${response.statusText}`)
    }

    const data = await response.json() as { next: string | null, results: { avatar_url?: string | null }[] }
    images.push(...data.results.flatMap(({ avatar_url }) => avatar_url ? [avatar_url] : []))
    url = data.next
  }
  return images
}

export default defineNuxtModule({
  meta: { name: 'self-host-remote-images' },
  setup(_, nuxt) {
    nuxt.hook('build:before', async () => {
      const isStaticBuild = process.argv.some((argument) => ['build', 'generate'].includes(argument))
      if (nuxt.options.dev || !isStaticBuild) {
        return
      }

      const cacheDir = resolve(nuxt.options.rootDir, CACHE_DIR)
      const cacheFilesDir = resolve(cacheDir, 'files')
      const publicDir = resolve(nuxt.options.rootDir, PUBLIC_DIR)
      const manifestPath = resolve(cacheDir, 'manifest.json')
      const manifest = await readManifest(manifestPath)
      await Promise.all([mkdir(cacheFilesDir, { recursive: true }), mkdir(publicDir, { recursive: true })])

      const sources = [...new Set(([
        ...await getSheetImages('贊助列表', ['image']),
        ...await getSheetImages('廣告', ['image:vertical', 'image:horizontal']),
        ...await getPretalxImages(),
      ]).map(normalizeRemoteImageUrl))]

      await runWithConcurrency(sources, async (source, index) => {
        const key = cacheKey(source)
        const cachedName = manifest[source]
        const cachedPath = cachedName && resolve(cacheFilesDir, cachedName)
        if (cachedName?.endsWith('.webp') && cachedPath && await stat(cachedPath).then(() => true).catch(() => false)) {
          logger.debug(`${index + 1}/${sources.length} cache hit: ${source}`)
          await copyFile(cachedPath, resolve(publicDir, cachedName))
          return
        }

        logger.debug(`${index + 1}/${sources.length} downloading: ${source}`)
        const filename = `${key}.webp`
        try {
          const image = await downloadImage(source)
          await writeFile(resolve(cacheFilesDir, filename), image)
          await copyFile(resolve(cacheFilesDir, filename), resolve(publicDir, filename))
          manifest[source] = filename
        } catch (error) {
          if (!isPretalxAvatar(source)) {
            throw error
          }

          logger.warn(`Pretalx avatar unavailable; using placeholder: ${source}`)
          manifest[source] = PRETALX_PLACEHOLDER
        }
      })

      await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
      logger.info(`Prepared ${sources.length} images`)
    })
  },
})
