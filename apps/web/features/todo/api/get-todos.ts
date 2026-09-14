import { apiClient } from "@/lib/api/client";

export function getTodos() {
  return apiClient.GET("/api/todos");
}
