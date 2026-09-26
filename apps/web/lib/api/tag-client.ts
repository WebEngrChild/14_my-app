import createClient from "openapi-fetch";

import { env } from "@/env/client";
import type { paths } from "./generated";

export const tagApiClient = createClient<paths>({
  baseUrl: env.NEXT_PUBLIC_TAG_MOCK_BASE_URL,
});
