"use client";

import { useEffect, useState } from "react";

import { getTodos } from "@/features/todo/api/get-todos";
import type { components } from "@/lib/api/generated";

type Todo = components["schemas"]["Todo"];

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    async function loadTodos() {
      const { data, error } = await getTodos();

      if (error) {
        console.error("TODOの取得に失敗しました", error);
        return;
      }

      setTodos(data);
    }

    void loadTodos();
  }, []);

  return { todos };
}
