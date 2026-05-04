import { definePretalxTableHandler } from '#server/utils/pretalx/handler'
import { SubmissionTypeSchema } from '#shared/types/pretalx'

export default definePretalxTableHandler('submission-types', SubmissionTypeSchema)
