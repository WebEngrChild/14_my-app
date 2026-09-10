import "zod-openapi";

import { z } from "zod";

export const TodoSchema = z
  .object({
    id: z.number().int(),
    title: z.string(),
    body: z.string(),
  })
  .meta({
    id: "Todo",
    description: "TODO",
  });

export const TodoListSchema = z.array(TodoSchema).meta({
  id: "TodoList",
  description: "TODO一覧",
});

export type Todo = z.infer<typeof TodoSchema>;

export const TodoCreateInput = TodoSchema.omit({ id: true });

export type TodoCreateInput = z.infer<typeof TodoCreateInput>;

export const TodoUpdateInput = TodoSchema.omit({ id: true }).partial().meta({
  id: "TodoUpdateInput",
  description: "TODO更新入力(部分更新)",
});

export type TodoUpdateInput = z.infer<typeof TodoUpdateInput>;

export const TodoIdParam = z.object({ id: z.coerce.number().int() });

export type TodoIdParam = z.infer<typeof TodoIdParam>;
