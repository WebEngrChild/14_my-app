"use client";

import { useTodos } from "@/features/todo/hooks/use-todos";

export default function TodoList() {
  const { todos } = useTodos();

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
