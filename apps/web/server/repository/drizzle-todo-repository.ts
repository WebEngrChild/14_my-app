import { type createDb, desc, eq } from "@my-app/db";
import { todos } from "@my-app/db/schema";

import type { Todo } from "@/server/domain/todo";
import type {
  TodoCreateInput,
  TodoRepository,
  TodoUpdateInput,
} from "@/server/repository/todo-repository";

const columns = {
  id: todos.id,
  title: todos.title,
  body: todos.body,
  createdAt: todos.createdAt,
};

const toTodo = (todo: typeof todos.$inferSelect): Todo => ({
  id: todo.id,
  title: todo.title,
  body: todo.body,
  createdAt: todo.createdAt.toISOString(),
});

export class DrizzleTodoRepository implements TodoRepository {
  constructor(private readonly db: ReturnType<typeof createDb>) {}

  async list() {
    // 新しいメモが上に並ぶ。作成時刻が同値でも順が揺れないようIDを第2キーにする。
    const rows = await this.db
      .select(columns)
      .from(todos)
      .orderBy(desc(todos.createdAt), desc(todos.id));
    return rows.map(toTodo);
  }

  async create(input: TodoCreateInput) {
    const [todo] = await this.db.insert(todos).values(input).returning(columns);
    return toTodo(todo);
  }

  async update(id: number, input: TodoUpdateInput) {
    const [todo] = await this.db
      .update(todos)
      .set(input)
      .where(eq(todos.id, id))
      .returning(columns);
    return todo ? toTodo(todo) : null;
  }

  async delete(id: number) {
    const [todo] = await this.db.delete(todos).where(eq(todos.id, id)).returning({ id: todos.id });
    return todo ?? null;
  }
}
