import { db } from "../../../packages/db";
import { todos } from "../../../packages/db/schema";

export async function listTodos() {
  return db
    .select({
      title: todos.title,
      body: todos.body,
    })
    .from(todos);
}
