export const ApiSuccessCode = {
  OK: "OK",
  CREATED: "CREATED",
  NO_CONTENT: "NO_CONTENT",
  ACCEPTED: "ACCEPTED",
} as const;

export type ApiSuccessCode =
  (typeof ApiSuccessCode)[keyof typeof ApiSuccessCode];
