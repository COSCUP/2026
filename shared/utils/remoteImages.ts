export function normalizeRemoteImageUrl(source: string): string {
  const match = source.match(/^https:\/\/drive\.google\.com\/file\/d\/([^/]+)/)
  return match?.[1] ? `https://drive.google.com/uc?export=view&id=${match[1]}` : source
}
