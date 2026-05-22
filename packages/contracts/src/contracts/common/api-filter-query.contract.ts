import z from "zod";

import { createPositiveIntSchema } from "../../lib/util/createPositiveIntSchema.util";

export const SortDirectionSchema = z.enum(["asc", "desc"]);

export const FilterQuerySchema = z.object({
  page: createPositiveIntSchema("page").default(1),
  pageSize: createPositiveIntSchema("pageSize").max(100).default(20),
  sortDirection: SortDirectionSchema.optional(),
});
