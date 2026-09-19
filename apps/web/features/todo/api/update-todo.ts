import type { MemoInput } from "@/features/todo/autosave/types";
import { apiClient } from "@/lib/api/client";

export function updateTodo(id: number, input: MemoInput, signal: AbortSignal) {
  return apiClient.PATCH("/api/todos/{id}", {
    params: { path: { id } },
    body: input,
    signal: AbortSignal.any([signal, AbortSignal.timeout(15_000)]),
  });
}
