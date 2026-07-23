import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { normalizeRemoteImageUrl } from '#shared/utils/remoteImages'

type ImageManifest = Record<string, string>

let manifest: ImageManifest | undefined

function getManifest(): ImageManifest {
  if (manifest) {
    return manifest
  }
  try {
    manifest = JSON.parse(readFileSync(resolve(process.cwd(), '.cache/remote-images/manifest.json'), 'utf8')) as ImageManifest
  } catch {
    manifest = {}
  }
  return manifest
}

export function selfHostedImageUrl(source: string): string {
  const filename = getManifest()[normalizeRemoteImageUrl(source)]
  return filename ? filename.startsWith('/') ? filename : `/_remote-images/${filename}` : source
}
