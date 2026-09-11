import "zod-openapi";

import { z } from "zod";

import { TodoSchema as DomainTodoSchema } from "@/server/domain/todo";

export const TodoSchema = DomainTodoSchema.meta({
  id: "Todo",
  description: "TODO",
});

export const TodoListSchema = z.array(TodoSchema).meta({
  id: "TodoList",
  description: "TODO一覧",
});

export type { Todo } from "@/server/domain/todo";

export const TodoCreateInput = TodoSchema.omit({ id: true });

export type TodoCreateInput = z.infer<typeof TodoCreateInput>;

export const TodoUpdateInput = TodoSchema.omit({ id: true }).partial().meta({
  id: "TodoUpdateInput",
  description: "TODO更新入力(部分更新)",
});

export type TodoUpdateInput = z.infer<typeof TodoUpdateInput>;

export const TodoIdParam = z.object({ id: z.coerce.number().int() });

export type TodoIdParam = z.infer<typeof TodoIdParam>;
