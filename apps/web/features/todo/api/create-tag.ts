import type { components } from "@/lib/api/generated";
import { tagApiClient } from "@/lib/api/tag-client";

export function createTag(input: components["schemas"]["TagCreateInput"]) {
  return tagApiClient.POST("/api/tags", { body: input });
}
