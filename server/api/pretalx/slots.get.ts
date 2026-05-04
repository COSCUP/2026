import { definePretalxTableHandler } from '#server/utils/pretalx/handler'
import { filterSlotsReachableFromConfirmedSubmissions } from '#server/utils/pretalx/reachable'
import { SlotSchema } from '#shared/types/pretalx'

export default definePretalxTableHandler(
  'slots',
  SlotSchema,
  filterSlotsReachableFromConfirmedSubmissions,
)
