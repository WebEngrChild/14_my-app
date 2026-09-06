import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const postgresUrl = z.url({
  protocol: /^postgres(?:ql)?$/,
  error: "PostgreSQLの接続URLを指定してください",
});

const httpUrl = z.url({
  protocol: /^https?$/,
  error: "http:// または https:// から始まるURLを指定してください",
});

export const env = createEnv({
  server: {
    DATABASE_URL: postgresUrl,
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: httpUrl,
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  },
  emptyStringAsUndefined: true,
});
