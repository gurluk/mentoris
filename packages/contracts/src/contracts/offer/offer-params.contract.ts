import z from "zod";

import { createPositiveIntSchema } from "../../lib/util/createPositiveIntSchema.util";

export const offerIdParamsSchema = z.object({
  offerId: createPositiveIntSchema("offerId"),
});
