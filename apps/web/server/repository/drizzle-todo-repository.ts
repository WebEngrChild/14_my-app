import { type createDb, eq } from "@my-app/db";
import { todos } from "@my-app/db/schema";

import type {
  TodoCreateInput,
  TodoRepository,
  TodoUpdateInput,
} from "@/server/repository/todo-repository";

const columns = {
  id: todos.id,
  title: todos.title,
  body: todos.body,
};

export class DrizzleTodoRepository implements TodoRepository {
  constructor(private readonly db: ReturnType<typeof createDb>) {}

  async list() {
    return this.db.select(columns).from(todos);
  }

  async create(input: TodoCreateInput) {
    const [todo] = await this.db.insert(todos).values(input).returning(columns);
    return todo;
  }

  async update(id: number, input: TodoUpdateInput) {
    const [todo] = await this.db
      .update(todos)
      .set(input)
      .where(eq(todos.id, id))
      .returning(columns);
    return todo ?? null;
  }

  async delete(id: number) {
    const [todo] = await this.db.delete(todos).where(eq(todos.id, id)).returning({ id: todos.id });
    return todo ?? null;
  }
}
