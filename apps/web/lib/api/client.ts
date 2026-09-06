import createClient from "openapi-fetch";

import { env } from "@/env/client";
import type { paths } from "./generated";

export const apiClient = createClient<paths>({
  baseUrl: env.NEXT_PUBLIC_API_BASE_URL ?? "",
});
