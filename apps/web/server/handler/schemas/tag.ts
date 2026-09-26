import "zod-openapi";

import { z } from "zod";

const TagNameSchema = z.string().trim().min(1);

export const TagSchema = z
  .object({
    id: z.number().int().positive(),
    name: TagNameSchema,
  })
  .meta({
    id: "Tag",
    description: "タグ",
  });

export const TagListSchema = z.array(TagSchema).meta({
  id: "TagList",
  description: "タグ一覧",
});

export const TagCreateInput = TagSchema.pick({ name: true }).meta({
  id: "TagCreateInput",
  description: "タグ作成入力",
});

export const TagListQuery = z.object({
  query: z.string().trim().optional(),
});

export const TagIdParam = z.object({
  id: z.coerce.number().int().positive(),
});

export const TodoTagIdsParam = z.object({
  id: z.coerce.number().int().positive(),
  tagId: z.coerce.number().int().positive(),
});

export type Tag = z.infer<typeof TagSchema>;
export type TagList = z.infer<typeof TagListSchema>;
export type TagCreateInput = z.infer<typeof TagCreateInput>;
export type TagListQuery = z.infer<typeof TagListQuery>;
export type TagIdParam = z.infer<typeof TagIdParam>;
export type TodoTagIdsParam = z.infer<typeof TodoTagIdsParam>;
