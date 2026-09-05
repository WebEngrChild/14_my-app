"use client";

import { useEffect, useState } from "react";

type Todo = {
  title: string;
  body: string;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    fetch("/api/todos")
      .then((response) => response.json())
      .then(setTodos);
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
