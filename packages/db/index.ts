import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export { and, asc, desc, eq, sql } from "drizzle-orm";

export function createDb(databaseUrl: string) {
  const client = postgres(databaseUrl, {
    prepare: false,
  });

  return drizzle({
    client,
  });
}
