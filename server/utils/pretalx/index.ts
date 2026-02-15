import type { IPretalxResponse, IPretalxResult } from './type'

const TOKEN = process.env.PRETALX_API_TOKEN
const BASE_RUL = 'https://pretalx.coscup.org/api/events/coscup-2025'

export default defineCachedFunction(
  async () => {
    const tables = ['submissions', 'submission-types', 'speakers', 'rooms', 'answers', 'slots'] as const
    const results: Partial<IPretalxResult> = {}

    for (const table of tables) {
      let url: string = table
      results[table] = { arr: [], map: {} } satisfies IPretalxData<typeof table>

      while (url) {
        const response = await $fetch<IPretalxResponse<typeof table>>(
          url,
          {
            baseURL: BASE_RUL,
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

    return results as IPretalxResult
  },
  {
    maxAge: 99999,
    name: 'pretalxData',
  },
)
