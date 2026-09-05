import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

const envFile = process.env.DRIZZLE_ENV_FILE;

if (!envFile) {
  throw new Error("DRIZZLE_ENV_FILE is not set");
}

config({ path: envFile, override: true });

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
