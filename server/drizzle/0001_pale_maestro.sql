ALTER TABLE "account" ALTER COLUMN "accessTokenExpiresAt" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "refreshTokenExpiresAt" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "createdAt" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "expiresAt" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "createdAt" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "expiresAt" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "createdAt" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "updatedAt" SET DEFAULT now();