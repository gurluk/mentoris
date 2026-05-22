import z from "zod";

export const CreateOfferReviewRequestSchema = z
  .object({
    description: z.string().optional(),
    rating: z.number(),
    offerId: z.number(),
  })
  .strict();

export type CreateOfferReviewRequest = z.infer<
  typeof CreateOfferReviewRequestSchema
>;
