import { definePretalxTableHandler } from '#server/utils/pretalx/handler'
import { filterSpeakersReachableFromConfirmedSubmissions } from '#server/utils/pretalx/reachable'
import { SpeakerSchema } from '#shared/types/pretalx'

export default definePretalxTableHandler(
  'speakers',
  SpeakerSchema,
  filterSpeakersReachableFromConfirmedSubmissions,
)
