import { tagApiClient } from "@/lib/api/tag-client";

export function getTags(query?: string, signal?: AbortSignal) {
  return tagApiClient.GET("/api/tags", {
    params: { query: { query } },
    signal,
  });
}
