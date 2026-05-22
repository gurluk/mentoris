import z from "zod";

import { StrictUtcTimestampSchema } from "../../lib/schema/date.schema";

export const OfferReviewSchema = z.object({
  id: z.number().int().positive(),
  rating: z.number(),
  description: z.string().nullable(),
  offerId: z.number().int().positive(),
  createdAt: StrictUtcTimestampSchema,
  user: z.object({
    profilePictureUrl: z.string().nullable(),
    name: z.string(),
  }),
});

export type OfferReview = z.infer<typeof OfferReviewSchema>;
