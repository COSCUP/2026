export function transformGoogleDriveImageUrl(source: string) {
  if (source.startsWith('https://drive.google.com/file/d/')) {
    const id = source.split('/')[5]

    return `https://drive.google.com/thumbnail?id=${id}`
  }

  return source
}
