import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export { desc, eq } from "drizzle-orm";

export function createDb(databaseUrl: string) {
  const client = postgres(databaseUrl, {
    prepare: false,
  });

  return drizzle({
    client,
  });
}
