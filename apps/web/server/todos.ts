import { todos } from "@my-app/db/schema";

import { db } from "@/server/db";

export async function listTodos() {
  return db
    .select({
      title: todos.title,
      body: todos.body,
    })
    .from(todos);
}
