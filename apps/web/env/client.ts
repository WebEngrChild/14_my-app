import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_API_BASE_URL: z.url().optional(),
    NEXT_PUBLIC_TAG_MOCK_BASE_URL: z.url().default("http://localhost:4010"),
  },
  runtimeEnv: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_TAG_MOCK_BASE_URL: process.env.NEXT_PUBLIC_TAG_MOCK_BASE_URL,
  },
  emptyStringAsUndefined: true,
});
