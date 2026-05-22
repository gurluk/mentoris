import z from "zod";

import { FilterQuerySchema } from "../../contracts/common/api-filter-query.contract";

export const createFilterQuerySchema = <TFilters extends z.ZodRawShape>(
  filters: TFilters,
) => FilterQuerySchema.extend(filters).strict();
