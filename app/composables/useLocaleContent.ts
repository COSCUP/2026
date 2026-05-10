import type { Collections } from '@nuxt/content'
import { withLeadingSlash, withoutTrailingSlash } from 'ufo'

export default async function useLocaleContent(
  _path: MaybeRefOrGetter<string>,
  locale: Ref<string>,
  defaultLocale: string,
) {
  const path = toValue(_path)
  const normalizedPath = computed(() => withoutTrailingSlash(withLeadingSlash(path)))
  const asyncDataKey = `page-${locale.value}-${normalizedPath.value}`

  const { data: content } = await useAsyncData(asyncDataKey, async () => {
    // Build collection name based on current locale
    const collection = (`content_${locale.value}`) as keyof Collections
    const content = await queryCollection(collection).path(normalizedPath.value).first()

    // Optional: fallback to default locale if content is missing
    if (!content && locale.value !== defaultLocale) {
      const fallbackCollection = (`content_${defaultLocale}`) as keyof Collections
      return await queryCollection(fallbackCollection).path(normalizedPath.value).first()
    }

    return content
  })

  return content
}
