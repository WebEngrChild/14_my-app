import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: "./apps/web/.env.local" });

const migrationUrl = process.env.DATABASE_MIGRATION_URL;

if (!migrationUrl) {
  throw new Error("DATABASE_MIGRATION_URL is not set");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./packages/db/schema.ts",
  out: "./packages/db/drizzle",
  dbCredentials: {
    url: migrationUrl,
  },
});
