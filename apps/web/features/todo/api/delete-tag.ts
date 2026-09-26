import { tagApiClient } from "@/lib/api/tag-client";

export function deleteTag(id: number) {
  return tagApiClient.DELETE("/api/tags/{id}", {
    params: { path: { id } },
  });
}
