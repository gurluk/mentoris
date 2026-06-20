CREATE TYPE "public"."mod_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'INACTIVE');--> statement-breakpoint
CREATE TABLE "offers_offer_categories" (
	"offer_id" integer NOT NULL,
	"offer_category_id" integer NOT NULL,
	CONSTRAINT "offers_offer_categories_offer_id_offer_category_id_pk" PRIMARY KEY("offer_id","offer_category_id")
);
--> statement-breakpoint
CREATE TABLE "offers_offer_formats" (
	"offer_id" integer NOT NULL,
	"offer_format_id" integer NOT NULL,
	CONSTRAINT "offers_offer_formats_offer_id_offer_format_id_pk" PRIMARY KEY("offer_id","offer_format_id")
);
--> statement-breakpoint
CREATE TABLE "offers_offer_levels" (
	"offer_id" integer NOT NULL,
	"offer_level_id" integer NOT NULL,
	CONSTRAINT "offers_offer_levels_offer_id_offer_level_id_pk" PRIMARY KEY("offer_id","offer_level_id")
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cities" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"label" varchar(50) NOT NULL,
	"active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cities_code_unique" UNIQUE("code"),
	CONSTRAINT "cities_label_unique" UNIQUE("label")
);
--> statement-breakpoint
CREATE TABLE "genders" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"label" varchar(50) NOT NULL,
	"active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "genders_code_unique" UNIQUE("code"),
	CONSTRAINT "genders_label_unique" UNIQUE("label")
);
--> statement-breakpoint
CREATE TABLE "offer_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"label" varchar(50) NOT NULL,
	"active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "offer_categories_code_unique" UNIQUE("code"),
	CONSTRAINT "offer_categories_label_unique" UNIQUE("label")
);
--> statement-breakpoint
CREATE TABLE "offer_formats" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"label" varchar(50) NOT NULL,
	"active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "offer_formats_code_unique" UNIQUE("code"),
	CONSTRAINT "offer_formats_label_unique" UNIQUE("label")
);
--> statement-breakpoint
CREATE TABLE "offer_levels" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"label" varchar(50) NOT NULL,
	"active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "offer_levels_code_unique" UNIQUE("code"),
	CONSTRAINT "offer_levels_label_unique" UNIQUE("label")
);
--> statement-breakpoint
CREATE TABLE "offer_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"offer_id" integer NOT NULL,
	"rating" numeric(2, 1) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"mod_status" "mod_status" DEFAULT 'PENDING' NOT NULL,
	"mod_by" integer,
	"mod_at" timestamp with time zone,
	"mod_reason" text
);
--> statement-breakpoint
CREATE TABLE "offers" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"user_id" text NOT NULL,
	"price_from_cents" integer,
	"price_to_cents" integer,
	"mod_status" "mod_status" DEFAULT 'PENDING' NOT NULL,
	"mod_by" integer,
	"mod_at" timestamp with time zone,
	"mod_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "offers_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_picture_url" varchar(255),
	"name" varchar(255) NOT NULL,
	"bio" text,
	"dob" date,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "offers_offer_categories" ADD CONSTRAINT "offers_offer_categories_offer_id_offers_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offers_offer_categories" ADD CONSTRAINT "offers_offer_categories_offer_category_id_offer_categories_id_fk" FOREIGN KEY ("offer_category_id") REFERENCES "public"."offer_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offers_offer_formats" ADD CONSTRAINT "offers_offer_formats_offer_id_offers_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offers_offer_formats" ADD CONSTRAINT "offers_offer_formats_offer_format_id_offer_formats_id_fk" FOREIGN KEY ("offer_format_id") REFERENCES "public"."offer_formats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offers_offer_levels" ADD CONSTRAINT "offers_offer_levels_offer_id_offers_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offers_offer_levels" ADD CONSTRAINT "offers_offer_levels_offer_level_id_offer_levels_id_fk" FOREIGN KEY ("offer_level_id") REFERENCES "public"."offer_levels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_reviews" ADD CONSTRAINT "offer_reviews_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_reviews" ADD CONSTRAINT "offer_reviews_offer_id_offers_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");