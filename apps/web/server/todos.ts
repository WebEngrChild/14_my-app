import { db } from "@my-app/db";
import { todos } from "@my-app/db/schema";

export async function listTodos() {
  return db
    .select({
      title: todos.title,
      body: todos.body,
    })
    .from(todos);
}
