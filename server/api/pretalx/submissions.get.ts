import { definePretalxTableHandler } from '#server/utils/pretalx/handler'
import { SubmissionSchema } from '#shared/types/pretalx'

export default definePretalxTableHandler(
  'submissions',
  SubmissionSchema,
  (items) => items.filter((s) => s.state === 'confirmed'),
)
