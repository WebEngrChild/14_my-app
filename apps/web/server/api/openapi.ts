import { createDocument } from "zod-openapi";

import { TodoCreateInput, TodoIdParam, TodoListSchema, TodoSchema, TodoUpdateInput } from "./schemas/todo";

export const openApiDocument = createDocument({
  openapi: "3.1.0",

  info: {
    title: "My Next.js API",
    version: "1.0.0",
  },

  paths: {
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
            },
          },
        },

        responses: {
          "201": {
            description: "TODOの作成成功",
            content: {
              "application/json": {
                schema: TodoSchema,
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
            },
          },
        },

        responses: {
          "200": {
            description: "TODOの更新成功",
            content: {
              "application/json": {
                schema: TodoSchema,
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
