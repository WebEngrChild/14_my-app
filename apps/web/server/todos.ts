import { todos } from "@my-app/db/schema";
import type { TodoCreateInput } from "@/server/api/schemas/todo";
import { db } from "@/server/db";

export async function listTodos() {
  return db
    .select({
      title: todos.title,
      body: todos.body,
    })
    .from(todos);
}

export async function createTodo(input: TodoCreateInput) {
  const [todo] = await db.insert(todos).values(input).returning({
    title: todos.title,
    body: todos.body,
  });

  return todo;
}
