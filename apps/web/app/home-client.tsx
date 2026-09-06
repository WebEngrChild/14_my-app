"use client";

import { useEffect, useState } from "react";

import { apiClient } from "@/lib/api/client";
import type { components } from "@/lib/api/generated";

type Todo = components["schemas"]["Todo"];

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    async function loadTodos() {
      const { data, error } = await apiClient.GET("/api/todos");

      if (error) {
        console.error("TODOの取得に失敗しました", error);
        return;
      }

      setTodos(data);
    }

    void loadTodos();
  }, []);

  return (
    <main>
      <h1>TODO</h1>

      {todos.map((todo) => (
        <article key={todo.title}>
          <h2>{todo.title}</h2>
          <p>{todo.body}</p>
        </article>
      ))}
    </main>
  );
}
