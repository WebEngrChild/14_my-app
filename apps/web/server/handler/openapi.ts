import { createDocument } from "zod-openapi";

import { TagCreateInput, TagIdParam, TagListQuery, TagListSchema, TagSchema } from "./schemas/tag";
import {
  TodoCreateInput,
  TodoIdParam,
  TodoListSchema,
  TodoSchema,
  TodoUpdateInput,
} from "./schemas/todo";

const memoExamples = TodoListSchema.parse([
  {
    id: 1,
    title: "買い物リストを更新する",
    body: "牛乳とパンを買う。帰りにスーパーへ寄る。",
    createdAt: "2026-09-15T18:15:00+09:00",
    updatedAt: "2026-09-15T18:15:00+09:00",
  },
  {
    id: 2,
    title: "Next.jsのメモ",
    body: "認証まわりの実装方針を整理する。",
    createdAt: "2026-09-14T21:30:00+09:00",
    updatedAt: "2026-09-14T21:30:00+09:00",
  },
  {
    id: 3,
    title: "Figmaでメモアプリのデザインを作成…",
    body: "メモアプリのレイアウトや余白、文字サイズなどを確認して全体のデザインを整えていく…",
    createdAt: "2026-09-13T19:10:00+09:00",
    updatedAt: "2026-09-13T19:10:00+09:00",
  },
]);

const tagExamples = TagListSchema.parse([
  { id: 1, name: "仕事" },
  { id: 2, name: "仕事関連" },
]);

export const openApiDocument = createDocument({
  openapi: "3.1.0",

  info: {
    title: "My Next.js API",
    version: "1.0.0",
  },

  paths: {
    "/api/tags": {
      get: {
        operationId: "listTags",
        summary: "タグ一覧・候補を取得する",
        description: "query指定時は名前の部分一致で検索する。省略時は一覧を返す。",
        tags: ["Tags"],
        requestParams: {
          query: TagListQuery,
        },
        responses: {
          "200": {
            description: "タグ一覧の取得成功",
            content: {
              "application/json": {
                schema: TagListSchema,
                example: tagExamples,
              },
            },
          },
        },
      },
      post: {
        operationId: "createTag",
        summary: "タグを作成する",
        tags: ["Tags"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: TagCreateInput,
              example: TagCreateInput.parse(tagExamples[0]),
            },
          },
        },
        responses: {
          "201": {
            description: "タグの作成成功",
            content: {
              "application/json": {
                schema: TagSchema,
                example: tagExamples[0],
              },
            },
          },
        },
      },
    },
    "/api/tags/{id}": {
      delete: {
        operationId: "deleteTag",
        summary: "タグを削除する",
        tags: ["Tags"],
        requestParams: {
          path: TagIdParam,
        },
        responses: {
          "204": {
            description: "タグの削除成功",
          },
          "404": {
            description: "指定したidのタグが存在しない",
          },
        },
      },
    },
    "/api/todos": {
      get: {
        operationId: "listTodos",
        summary: "TODO一覧を取得する",
        tags: ["Todos"],

        responses: {
          "200": {
            description: "TODO一覧の取得成功",
            content: {
              "application/json": {
                schema: TodoListSchema,
                example: memoExamples,
              },
            },
          },
        },
      },

      post: {
        operationId: "createTodo",
        summary: "TODOを作成する",
        tags: ["Todos"],

        requestBody: {
          content: {
            "application/json": {
              schema: TodoCreateInput,
              example: TodoCreateInput.parse(memoExamples[0]),
            },
          },
        },

        responses: {
          "201": {
            description: "TODOの作成成功",
            content: {
              "application/json": {
                schema: TodoSchema,
                example: memoExamples[0],
              },
            },
          },
        },
      },
    },

    "/api/todos/{id}": {
      patch: {
        operationId: "updateTodo",
        summary: "TODOを更新する",
        tags: ["Todos"],

        requestParams: {
          path: TodoIdParam,
        },

        requestBody: {
          content: {
            "application/json": {
              schema: TodoUpdateInput,
              example: TodoUpdateInput.parse({ body: "牛乳とパン、卵を買う。" }),
            },
          },
        },

        responses: {
          "200": {
            description: "TODOの更新成功",
            content: {
              "application/json": {
                schema: TodoSchema,
                example: {
                  ...memoExamples[0],
                  body: "牛乳とパン、卵を買う。",
                  updatedAt: "2026-09-16T08:00:00+09:00",
                },
              },
            },
          },
          "404": {
            description: "指定したidのTODOが存在しない",
          },
        },
      },

      delete: {
        operationId: "deleteTodo",
        summary: "TODOを削除する",
        tags: ["Todos"],

        requestParams: {
          path: TodoIdParam,
        },

        responses: {
          "204": {
            description: "TODOの削除成功",
          },
          "404": {
            description: "指定したidのTODOが存在しない",
          },
        },
      },
    },
  },
});
