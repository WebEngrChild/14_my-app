import type { MemoInput } from "@/features/todo/autosave/types";
import { apiClient } from "@/lib/api/client";

export function createTodo(input: MemoInput, signal: AbortSignal) {
  return apiClient.POST("/api/todos", {
    body: input,
    signal: AbortSignal.any([signal, AbortSignal.timeout(15_000)]),
  });
}
