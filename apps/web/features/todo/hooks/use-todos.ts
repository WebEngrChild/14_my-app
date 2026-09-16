"use client";

import { useEffect, useState } from "react";

import { getTodos } from "@/features/todo/api/get-todos";
import type { components } from "@/lib/api/generated";

type Todo = components["schemas"]["Todo"];

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function loadTodos() {
      try {
        const { data, response } = await getTodos(controller.signal);
        if (!response.ok || !data) {
          throw new Error("メモの取得に失敗しました");
        }
        if (!controller.signal.aborted) setTodos(data);
      } catch {
        if (!controller.signal.aborted) setError("メモの取得に失敗しました");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void loadTodos();
    return () => controller.abort();
  }, []);

  return { todos, isLoading, error };
}
