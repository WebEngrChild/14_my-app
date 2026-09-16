import "zod-openapi";

import { z } from "zod";

import { TodoSchema as DomainTodoSchema } from "@/server/domain/todo";

export const TodoSchema = DomainTodoSchema.extend({
  createdAt: z.iso.datetime({ offset: true }),
}).meta({
  id: "Todo",
  description: "TODO",
});

export const TodoListSchema = z.array(TodoSchema).meta({
  id: "TodoList",
  description: "TODO一覧",
});

export type Todo = z.infer<typeof TodoSchema>;

// 入力可能な項目を明示し、レスポンスの項目追加が入力契約に波及しないようにする。
export const TodoCreateInput = TodoSchema.pick({ title: true, body: true });

export type TodoCreateInput = z.infer<typeof TodoCreateInput>;

export const TodoUpdateInput = TodoCreateInput.partial().meta({
  id: "TodoUpdateInput",
  description: "TODO更新入力(部分更新)",
});

export type TodoUpdateInput = z.infer<typeof TodoUpdateInput>;

export const TodoIdParam = z.object({ id: z.coerce.number().int() });

export type TodoIdParam = z.infer<typeof TodoIdParam>;
