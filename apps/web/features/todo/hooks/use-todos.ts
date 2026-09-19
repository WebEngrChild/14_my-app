"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { getTodos } from "@/features/todo/api/get-todos";
import type { components } from "@/lib/api/generated";

type Todo = components["schemas"]["Todo"];

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  // 取得失敗からの再読み込みでも同じ処理を使い、前回の通信は中断する。
  const load = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setIsLoading(true);
    setError(null);

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
  }, []);

  useEffect(() => {
    void load();
    return () => controllerRef.current?.abort();
  }, [load]);

  return { todos, isLoading, error, reload: load };
}
