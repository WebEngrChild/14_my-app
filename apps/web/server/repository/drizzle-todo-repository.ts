import { and, type createDb, desc, eq, exists, or, sql } from "@my-app/db";
import { tags, todos, todoTags } from "@my-app/db/schema";

import type { Todo } from "@/server/domain/todo";
import type {
  TodoCreateInput,
  TodoListFilter,
  TodoRepository,
  TodoUpdateInput,
} from "@/server/repository/todo-repository";

const columns = {
  id: todos.id,
  title: todos.title,
  body: todos.body,
  createdAt: todos.createdAt,
  updatedAt: todos.updatedAt,
};

const toTodo = (todo: typeof todos.$inferSelect): Todo => ({
  id: todo.id,
  title: todo.title,
  body: todo.body,
  createdAt: todo.createdAt.toISOString(),
  updatedAt: todo.updatedAt.toISOString(),
});

export class DrizzleTodoRepository implements TodoRepository {
  constructor(private readonly db: ReturnType<typeof createDb>) {}

  async list({ q, tag }: TodoListFilter = {}) {
    // 新しい/直近で更新されたメモが上に並ぶ。更新時刻が同値でも順が揺れないようIDを第2キーにする。
    const rows = await this.db
      .select(columns)
      .from(todos)
      .where(
        and(
          // LIKEのワイルドカード(% _)をエスケープせずに済むよう、タグ検索と同じくstrposで部分一致を判定する。
          q
            ? or(
                sql<boolean>`strpos(${todos.title}, ${q}) > 0`,
                sql<boolean>`strpos(${todos.body}, ${q}) > 0`,
              )
            : undefined,
          tag
            ? exists(
                this.db
                  .select({ id: todoTags.todoId })
                  .from(todoTags)
                  .innerJoin(tags, eq(todoTags.tagId, tags.id))
                  .where(and(eq(todoTags.todoId, todos.id), eq(tags.name, tag))),
              )
            : undefined,
        ),
      )
      .orderBy(desc(todos.updatedAt), desc(todos.id));
    return rows.map(toTodo);
  }

  async create(input: TodoCreateInput) {
    const [todo] = await this.db.insert(todos).values(input).returning(columns);
    return toTodo(todo);
  }

  async update(id: number, input: TodoUpdateInput) {
    const [todo] = await this.db
      .update(todos)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(todos.id, id))
      .returning(columns);
    return todo ? toTodo(todo) : null;
  }

  async delete(id: number) {
    const [todo] = await this.db.delete(todos).where(eq(todos.id, id)).returning({ id: todos.id });
    return todo ?? null;
  }
}
