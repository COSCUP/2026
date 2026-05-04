import { definePretalxTableHandler } from '#server/utils/pretalx/handler'
import { filterAnswersReachableFromConfirmedSubmissions } from '#server/utils/pretalx/reachable'
import { AnswerSchema } from '#shared/types/pretalx'

export default definePretalxTableHandler(
  'answers',
  AnswerSchema,
  filterAnswersReachableFromConfirmedSubmissions,
)
