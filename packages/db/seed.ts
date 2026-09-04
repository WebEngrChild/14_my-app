import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { todos } from "./schema";

config({ path: "./apps/web/.env.local" });

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

await db.insert(todos).values([
  {
    title: "TODO 1",
    body: "本文 1",
  },
  {
    title: "TODO 2",
    body: "本文 2",
  },
  {
    title: "TODO 3",
    body: "本文 3",
  },
  {
    title: "TODO 4",
    body: "本文 4",
  },
  {
    title: "TODO 5",
    body: "本文 5",
  },
]);

await client.end();

console.log("Seed completed");
