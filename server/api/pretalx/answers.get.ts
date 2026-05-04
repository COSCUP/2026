import { definePretalxTableHandler } from '#server/utils/pretalx/handler'
import { AnswerSchema } from '#shared/types/pretalx'

export default definePretalxTableHandler('answers', AnswerSchema)
