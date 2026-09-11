import { createDb } from "@my-app/db";

import { env } from "@/env/server";

export const db = createDb(env.DATABASE_URL);
