import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import type { createDb } from "@my-app/db";
import * as schema from "@my-app/db/schema";
import { betterAuth } from "better-auth";

type Database = ReturnType<typeof createDb>;

type CreateAuthOptions = {
  db: Database;
  secret: string;
  baseURL: string;
};

export function createAuth({ db, secret, baseURL }: CreateAuthOptions) {
  return betterAuth({
    secret,
    baseURL,
    database: drizzleAdapter(db, {
      provider: "pg",
      schema,
    }),

    emailAndPassword: {
      enabled: true,
    },
  });
}
