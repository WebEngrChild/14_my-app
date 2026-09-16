import { apiClient } from "@/lib/api/client";

export function getTodos(signal?: AbortSignal) {
  return apiClient.GET("/api/todos", { signal });
}
