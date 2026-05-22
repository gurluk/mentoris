import { z } from "zod";

export const FilterMetaSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  totalResults: z.number(),
  totalPages: z.number(),
});

export type FilterMeta = z.infer<typeof FilterMetaSchema>;
export type ResponseMeta = FilterMeta;
export type ResponseMetaSchema = typeof FilterMetaSchema;
