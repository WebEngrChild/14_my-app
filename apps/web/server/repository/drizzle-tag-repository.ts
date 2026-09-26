import { and, asc, type createDb, eq, sql } from "@my-app/db";
import { tags, todos, todoTags } from "@my-app/db/schema";

import type { TagRepository } from "@/server/repository/tag-repository";

const tagColumns = { id: tags.id, name: tags.name };

export class DrizzleTagRepository implements TagRepository {
  constructor(private readonly db: ReturnType<typeof createDb>) {}

  list(query?: string) {
    return this.db
      .select(tagColumns)
      .from(tags)
      .where(query ? sql<boolean>`strpos(${tags.name}, ${query}) > 0` : undefined)
      .orderBy(asc(tags.name), asc(tags.id));
  }

  async create(name: string) {
    const [tag] = await this.db
      .insert(tags)
      .values({ name })
      .onConflictDoNothing()
      .returning(tagColumns);
    return tag ?? null;
  }

  async delete(id: number) {
    const [tag] = await this.db.delete(tags).where(eq(tags.id, id)).returning({ id: tags.id });
    return Boolean(tag);
  }

  async listForTodo(todoId: number) {
    const [todo] = await this.db.select({ id: todos.id }).from(todos).where(eq(todos.id, todoId));
    if (!todo) return null;

    return this.db
      .select(tagColumns)
      .from(todoTags)
      .innerJoin(tags, eq(todoTags.tagId, tags.id))
      .where(eq(todoTags.todoId, todoId))
      .orderBy(asc(tags.name), asc(tags.id));
  }

  attach(todoId: number, tagId: number) {
    return this.db.transaction(async (tx) => {
      const [todo] = await tx
        .select({ id: todos.id })
        .from(todos)
        .where(eq(todos.id, todoId))
        .for("update");
      if (!todo) return false;

      const [tag] = await tx
        .select({ id: tags.id })
        .from(tags)
        .where(eq(tags.id, tagId))
        .for("update");
      if (!tag) return false;

      await tx.insert(todoTags).values({ todoId, tagId }).onConflictDoNothing();
      return true;
    });
  }

  detach(todoId: number, tagId: number) {
    return this.db.transaction(async (tx) => {
      const [todo] = await tx
        .select({ id: todos.id })
        .from(todos)
        .where(eq(todos.id, todoId))
        .for("update");
      if (!todo) return false;

      const [tag] = await tx
        .select({ id: tags.id })
        .from(tags)
        .where(eq(tags.id, tagId))
        .for("update");
      if (!tag) return false;

      await tx.delete(todoTags).where(and(eq(todoTags.todoId, todoId), eq(todoTags.tagId, tagId)));
      return true;
    });
  }
}
