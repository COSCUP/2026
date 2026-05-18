import type { StaffGroupKey, StaffMember } from '#shared/types/staff'
import { STAFF_GROUP_KEYS, staffGroupKeyByName } from '#shared/types/staff'
import { fetchSheet } from '../utils/sheets'

const FALLBACK_AVATAR = 'https://volunteer.coscup.org/img/nonavatar.png'
const gravatar = (hash: string) => `https://www.gravatar.com/avatar/${hash}?s=320&r=g&d=${encodeURIComponent(FALLBACK_AVATAR)}`

export default defineEventHandler(async () => {
  const staffRows = await fetchSheet('staff')
  const initialMembersByGroup = Object.fromEntries(STAFF_GROUP_KEYS.map((groupKey) => [groupKey, [] as StaffMember[]])) as Record<StaffGroupKey, StaffMember[]>

  const membersByGroup = staffRows.reduce<Record<StaffGroupKey, StaffMember[]>>((membersByGroup, { group, name, title, hash }) => {
    const groupKey = staffGroupKeyByName[group]
    const groupMembers = membersByGroup[groupKey]
    groupMembers.push({ name, title, hash, avatar: gravatar(hash) })

    return membersByGroup
  }, initialMembersByGroup)

  return STAFF_GROUP_KEYS
    .map((groupKey) => ({ group: groupKey, members: membersByGroup[groupKey] }))
    .filter(({ members }) => members.length > 0)
})
