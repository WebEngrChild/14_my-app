import "zod-openapi";

import { z } from "zod";

export const TodoSchema = z
  .object({
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

export const TodoCreateInput = TodoSchema;

export type TodoCreateInput = z.infer<typeof TodoCreateInput>;
