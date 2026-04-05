ALTER TABLE "users_table" ADD COLUMN "avatar_url" text;--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;