import { createAuth } from "@my-app/auth";

import { env } from "@/env/server";
import { db } from "@/server/repository/db";

export const auth = createAuth({
  db,
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
});
