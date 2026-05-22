import z from "zod";

import { DictionarySchema } from "../dictionary/dictionary.contract";

export const OfferSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),

  priceFromCents: z.number().int().nonnegative(),
  priceToCents: z.number().int().nonnegative(),

  levels: z.array(DictionarySchema),
  formats: z.array(DictionarySchema),
  categories: z.array(DictionarySchema),
});

export type Offer = z.infer<typeof OfferSchema>;
