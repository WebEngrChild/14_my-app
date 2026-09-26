import { apiClient } from "@/lib/api/client";

export function getTodoTags(id: number, signal?: AbortSignal) {
  return apiClient.GET("/api/todos/{id}/tags", {
    params: { path: { id } },
    signal,
  });
}
