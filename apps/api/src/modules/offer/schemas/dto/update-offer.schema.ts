import { createUpdateSchema } from "drizzle-zod";
import z from "zod";

import { offers } from "~/db/schema";

export const UpdateOfferRequestSchema = createUpdateSchema(offers)
  .pick({
    title: true,
    description: true,
    price_from_cents: true,
    price_to_cents: true,
    updated_at: true,
  })
  .extend({
    formatIdList: z.array(z.number()).optional(),
    levelIdList: z.array(z.number()).optional(),
    categoryIdList: z.array(z.number()).optional(),
  })
  .refine(
    (payload) => {
      if (payload.price_from_cents == null || payload.price_to_cents == null)
        return true;
      return payload.price_from_cents <= payload.price_to_cents;
    },
    {
      message: "Price range is invalid",
      path: ["price_to_cents"],
    },
  )
  .strict();

export type UpdateOfferRequest = z.infer<typeof UpdateOfferRequestSchema>;
