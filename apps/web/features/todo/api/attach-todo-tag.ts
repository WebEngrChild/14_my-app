import { apiClient } from "@/lib/api/client";

export function attachTodoTag(id: number, tagId: number) {
  return apiClient.PUT("/api/todos/{id}/tags/{tagId}", {
    params: { path: { id, tagId } },
  });
}
