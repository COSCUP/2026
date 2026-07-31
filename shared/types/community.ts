import { z } from 'zod'

export const CommunityRowSchema = z.object({
  id: z.string(),
  booth: z.string(),
  track: z.string(),
})

export const CommunitySchema = CommunityRowSchema

export type CommunityRow = z.infer<typeof CommunityRowSchema>
export type Community = z.infer<typeof CommunitySchema>
