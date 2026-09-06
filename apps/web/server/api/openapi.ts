import { createDocument } from "zod-openapi";

import { TodoListSchema } from "./schemas/todo";

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
    },
  },
});
