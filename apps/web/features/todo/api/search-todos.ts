import { apiClient } from "@/lib/api/client";

export function searchTodos(params: { q?: string; tag?: string }, signal?: AbortSignal) {
  return apiClient.GET("/api/todos", {
    params: { query: params },
    signal,
  });
}
