import { definePretalxTableHandler } from '#server/utils/pretalx/handler'
import { RoomSchema } from '#shared/types/pretalx'

export default definePretalxTableHandler('rooms', RoomSchema)
