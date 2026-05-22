import { z } from "zod";

import { ApiErrorCode } from "./api-error-codes";

export const ApiErrorCodeSchema = z.enum(ApiErrorCode);

export const FieldErrorsSchema = z
  .record(z.string(), z.array(z.string()))
  .nullable();

export const ErrorResponseSchema = z.object({
  code: ApiErrorCodeSchema,
  message: z.string().nullable(),
  fieldErrors: FieldErrorsSchema,
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
