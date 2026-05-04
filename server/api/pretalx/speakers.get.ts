import { definePretalxTableHandler } from '#server/utils/pretalx/handler'
import { SpeakerSchema } from '#shared/types/pretalx'

export default definePretalxTableHandler('speakers', SpeakerSchema)
