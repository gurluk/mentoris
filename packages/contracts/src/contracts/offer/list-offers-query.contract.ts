import z from "zod";

import { createFilterQuerySchema } from "../../lib/util/createFilterQuerySchema.util";
import { createPositiveIntSchema } from "../../lib/util/createPositiveIntSchema.util";

// TODO
export const ListOffersQuerySchema = createFilterQuerySchema({
  cityId: createPositiveIntSchema("cityId").optional(),
  categoryId: createPositiveIntSchema("categoryId").optional(),
});

type ListOffersQuery = z.infer<typeof ListOffersQuerySchema>;
