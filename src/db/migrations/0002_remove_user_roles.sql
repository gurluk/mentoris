ALTER TABLE "users" DROP CONSTRAINT "users_role_id_user_roles_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" varchar(50);--> statement-breakpoint
UPDATE "users"
SET "role" = "user_roles"."code"
FROM "user_roles"
WHERE "users"."role_id" = "user_roles"."id";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "role_id";--> statement-breakpoint
DROP TABLE "user_roles";
