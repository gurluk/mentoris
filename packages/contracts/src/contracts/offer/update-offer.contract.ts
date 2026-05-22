import { z } from "zod";

export const UpdateOfferRequestSchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().min(10).optional(),

    priceFromCents: z.number().int().nonnegative().optional(),
    priceToCents: z.number().int().nonnegative().optional(),

    formatIdList: z.array(z.number()).optional(),
    levelIdList: z.array(z.number()).optional(),
    categoryIdList: z.array(z.number()).optional(),
  })
  .strict()
  .refine(
    (data) => {
      if (data.priceFromCents == null || data.priceToCents == null) {
        return true;
      }

      return data.priceFromCents <= data.priceToCents;
    },
    {
      message: "Price range is invalid",
      path: ["priceToCents"],
    },
  );

export type UpdateOfferRequest = z.infer<typeof UpdateOfferRequestSchema>;
