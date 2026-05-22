import z from "zod";

export const createPositiveIntSchema = (name: string) =>
  z.coerce
    .number(`${name} must be a valid number`)
    .int(`${name} must be an integer`)
    .positive(`${name} must be a positive number`);
