import { z } from "zod";

/** TODOの定義。HTTPやOpenAPIに依存せず、既存の検証ルールを保持する。 */
export const TodoSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  body: z.string(),
  createdAt: z.iso.datetime({ offset: true }),
});

export type Todo = z.infer<typeof TodoSchema>;
