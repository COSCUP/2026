import type { PretalxData, PretalxResponse, PretalxResult } from './type'

export default defineCachedFunction(
  async () => {
    const { TOKEN, BASE_URL } = useRuntimeConfig()

    if (!TOKEN || !BASE_URL) {
      return null
    }

    const tables = ['submissions', 'submission-types', 'speakers', 'rooms', 'answers', 'slots'] as const
    const results: Partial<PretalxResult> = {}

    for (const table of tables) {
      let url: string = table
      results[table] = { arr: [], map: {} } satisfies PretalxData<typeof table>

      while (url) {
        const response = await $fetch<PretalxResponse<typeof table>>(
          url,
          {
            baseURL: BASE_URL,
            headers: {
              Authorization: `Token ${TOKEN}`,
            },
          },
        )

        results[table].arr.push(...response.results)
        Object.assign(results[table].map, Object.fromEntries(response.results.map((item: any) => [item.id || item.code, item])))
        url = response.next
      }
    }

    return results as PretalxResult
  },
  {
    maxAge: Infinity,
    name: 'pretalxData',
  },
)
