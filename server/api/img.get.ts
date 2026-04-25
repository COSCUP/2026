const fetchImage = defineCachedFunction(async (url: string) => {
  const response = await $fetch.raw<ArrayBuffer>(url, { responseType: 'arrayBuffer' })
  return response
}, { maxAge: Infinity })

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const url = query.url as string

  if (!url) {
    throw createError({ statusCode: 400, statusMessage: 'Missing url' })
  }

  const response = await fetchImage(url)

  if (!response.ok) {
    throw createError({ statusCode: response.status, statusMessage: 'Failed to fetch image' })
  }

  setHeader(event, 'Content-Type', response.headers.get('content-type') ?? 'image/jpeg')
  return Buffer.from(response._data as ArrayBuffer)
})
