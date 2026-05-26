export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const content = await $fetch<string>(`https://hackmd.io/@coscup/${id}/download`, {
    responseType: 'text',
  })

  return content
})
