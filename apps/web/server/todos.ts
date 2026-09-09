import { eq } from "@my-app/db";
import { todos } from "@my-app/db/schema";
import type { TodoCreateInput, TodoUpdateInput } from "@/server/api/schemas/todo";
import { db } from "@/server/db";

export async function listTodos() {
  return db
    .select({
      id: todos.id,
      title: todos.title,
      body: todos.body,
    })
    .from(todos);
}

export async function createTodo(input: TodoCreateInput) {
  const [todo] = await db.insert(todos).values(input).returning({
    id: todos.id,
    title: todos.title,
    body: todos.body,
  });

  return todo;
}

export async function updateTodo(id: number, input: TodoUpdateInput) {
  const [todo] = await db.update(todos).set(input).where(eq(todos.id, id)).returning({
    id: todos.id,
    title: todos.title,
    body: todos.body,
  });

  return todo ?? null;
}
