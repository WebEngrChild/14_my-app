import { apiClient } from "@/lib/api/client";

export function detachTodoTag(id: number, tagId: number) {
  return apiClient.DELETE("/api/todos/{id}/tags/{tagId}", {
    params: { path: { id, tagId } },
  });
}
