import { z } from "zod";

import {
  ResponseMeta,
  ResponseMetaSchema,
} from "./api-success-response-meta.contract";

export const ApiResponseSchema = <TData extends z.ZodType>(dataSchema: TData) =>
  z.object({
    data: dataSchema,
  });

export const ApiResponseWithMetaSchema = <
  TData extends z.ZodType,
  TMeta extends ResponseMetaSchema,
>(
  dataSchema: TData,
  metaSchema: TMeta,
) =>
  z.object({
    data: dataSchema,
    meta: metaSchema,
  });

export const ApiResponseNoContentSchema = z.undefined();

export type ApiResponse<TData> = {
  data: TData;
};

export type ApiResponseWithMeta<TData, TMeta extends ResponseMeta> = {
  data: TData;
  meta: TMeta;
};

export type ApiResponseNoContent = z.infer<typeof ApiResponseNoContentSchema>;
