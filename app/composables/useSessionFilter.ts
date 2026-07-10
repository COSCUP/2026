import type { SessionSummary } from '#shared/types/session'

export interface FilterOption {
  id: string
  label: string
}

interface UseSessionFilterOptions {
  sessionsByDay: MaybeRefOrGetter<Record<string, SessionSummary[]> | null | undefined>
  selectedDay: MaybeRefOrGetter<string | null | undefined>
  locale: MaybeRefOrGetter<'zh' | 'en'>
}

function roomId(session: SessionSummary) {
  return session.room?.en || session.room?.['zh-hant'] || ''
}

export function useSessionFilter({ sessionsByDay, selectedDay, locale }: UseSessionFilterOptions) {
  const searchQuery = ref('')
  const rawSelectedRoomIds = ref<string[]>([])
  const rawSelectedTagIds = ref<string[]>([])

  const isZh = computed(() => toValue(locale) !== 'en')

  const daySessions = computed<SessionSummary[]>(() => {
    const day = toValue(selectedDay)
    return day ? toValue(sessionsByDay)?.[day] ?? [] : []
  })

  function roomLabel(session: SessionSummary) {
    const { en = '', 'zh-hant': zh = '' } = session.room ?? {}
    return isZh.value ? zh || en : en || zh
  }

  // The session type is offered as a filterable tag alongside its real tags.
  function sessionTags(session: SessionSummary): FilterOption[] {
    return [
      { id: `type:${session.zh.type}\u0000${session.en.type}`, label: session[toValue(locale)].type },
      ...session.tags.map((tag) => ({ id: `tag:${tag}`, label: tag })),
    ].filter((tag) => tag.label)
  }

  function dedupeAndSort(options: FilterOption[]) {
    const byId = new Map(options.map((option) => [option.id, option]))
    return [...byId.values()].sort((a, b) => a.label.localeCompare(b.label, isZh.value ? 'zh-Hant' : 'en'))
  }

  const roomOptions = computed(() => dedupeAndSort(
    daySessions.value
      .filter((session) => roomId(session))
      .map((session) => ({ id: roomId(session), label: roomLabel(session) })),
  ))

  const tagOptions = computed(() => dedupeAndSort(daySessions.value.flatMap(sessionTags)))

  // Drop any selection that no longer matches an available option (e.g. after a day switch).
  function clampToOptions(raw: Ref<string[]>, options: Ref<FilterOption[]>) {
    return computed<string[]>({
      get: () => {
        const ids = new Set(options.value.map((option) => option.id))
        return raw.value.filter((id) => ids.has(id))
      },
      set: (value) => void (raw.value = value),
    })
  }

  const selectedRoomIds = clampToOptions(rawSelectedRoomIds, roomOptions)
  const selectedTagIds = clampToOptions(rawSelectedTagIds, tagOptions)

  const filteredSessions = computed(() => {
    const rooms = new Set(selectedRoomIds.value)
    const tags = new Set(selectedTagIds.value)
    const query = searchQuery.value.toLocaleLowerCase().trim()
    const contentLang = toValue(locale)

    return daySessions.value.filter((session) => {
      if (rooms.size && !rooms.has(roomId(session))) {
        return false
      }

      if (tags.size && !sessionTags(session).some((tag) => tags.has(tag.id))) {
        return false
      }

      if (!query) {
        return true
      }

      const content = session[contentLang]
      const haystack = [
        content.title,
        content.describe,
        ...session.speakers.flatMap((speaker) => [speaker[contentLang].name, speaker.id]),
      ].join('\n').toLocaleLowerCase()

      return haystack.includes(query)
    })
  })

  return {
    searchQuery,
    daySessions,
    filteredSessions,
    roomOptions,
    tagOptions,
    selectedRoomIds,
    selectedTagIds,
  }
}
