import { definePretalxTableHandler } from '#server/utils/pretalx/handler'
import { SlotSchema } from '#shared/types/pretalx'

export default definePretalxTableHandler('slots', SlotSchema)
