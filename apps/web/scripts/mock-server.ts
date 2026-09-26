import { createMockServer } from "@scalar/mock-server";

import { openApiDocument } from "../server/handler/openapi";

const tagSchema = openApiDocument.components?.schemas?.Tag;

// mock専用の振る舞い。公開するOpenAPI定義には追加しない。
const document = {
  ...openApiDocument,
  components: {
    ...openApiDocument.components,
    schemas: {
      ...openApiDocument.components?.schemas,
      Tag: {
        ...(typeof tagSchema === "object" ? tagSchema : {}),
        "x-seed": `
          seed([
            { id: 1, name: "仕事" },
            { id: 2, name: "仕事関連" },
          ]);
        `,
      },
    },
  },
  paths: {
    ...openApiDocument.paths,
    "/api/tags": {
      ...openApiDocument.paths?.["/api/tags"],
      get: {
        ...openApiDocument.paths?.["/api/tags"]?.get,
        "x-handler": `
          const query = (req.query.query ?? "").trim();
          return store.list("Tag").filter((tag) => tag.name.includes(query));
        `,
      },
      post: {
        ...openApiDocument.paths?.["/api/tags"]?.post,
        "x-handler": `
          const tags = store.list("Tag");
          const id = Math.max(0, ...tags.map((tag) => tag.id)) + 1;
          return store.create("Tag", { id, name: req.body.name.trim() });
        `,
      },
    },
    "/api/tags/{id}": {
      ...openApiDocument.paths?.["/api/tags/{id}"],
      delete: {
        ...openApiDocument.paths?.["/api/tags/{id}"]?.delete,
        "x-handler": `
          store.delete("Tag", req.params.id);
        `,
      },
    },
  },
};

const app = await createMockServer({
  document,
});

const server = Bun.serve({
  port: 4010,
  fetch: app.fetch,
});

console.log(`Mock server: ${server.url}`);
