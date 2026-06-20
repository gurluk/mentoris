import { relations } from "drizzle-orm";
import { date, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

import { user } from "./auth/auth.schema";
import { timestampColumns } from "../partials/timestampColumns";

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  profile_picture_url: varchar("profile_picture_url", { length: 255 }),
  name: varchar("name", { length: 255 }).notNull(),
  bio: text("bio"),
  dob: date("dob"),
  user_id: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .unique(),
  ...timestampColumns,
});

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(user, {
    fields: [profiles.user_id],
    references: [user.id],
  }),
}));
