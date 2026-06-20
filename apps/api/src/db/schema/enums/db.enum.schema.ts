import { pgEnum } from "drizzle-orm/pg-core";

export const STATUS_ENUM = pgEnum("mod_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "INACTIVE",
]);

export type ModStatus = (typeof STATUS_ENUM.enumValues)[number];
