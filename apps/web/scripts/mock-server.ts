import { createMockServer } from "@scalar/mock-server";

import { openApiDocument } from "../server/handler/openapi";

const todoSchema = openApiDocument.components?.schemas?.Todo;
const tagSchema = openApiDocument.components?.schemas?.Tag;

// mock専用の振る舞い。公開するOpenAPI定義には追加しない。
const document = {
  ...openApiDocument,
  components: {
    ...openApiDocument.components,
    schemas: {
      ...openApiDocument.components?.schemas,
      Todo: {
        ...(typeof todoSchema === "object" ? todoSchema : {}),
        "x-seed": `
          seed([
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
        `,
      },
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
    "/api/todos": {
      ...openApiDocument.paths?.["/api/todos"],
      get: {
        ...openApiDocument.paths?.["/api/todos"]?.get,
        "x-handler": `
          // mock専用: メモとタグの紐付け(メモid → タグ名)
          const todoTags = { 1: ["仕事"], 2: ["仕事関連"] };
          const q = (req.query.q ?? "").trim();
          const tag = (req.query.tag ?? "").trim();
          // 本番と同じく、更新日時の降順・同値ならID降順で返す。
          return store
            .list("Todo")
            .filter(
              (todo) =>
                (todo.title.includes(q) || todo.body.includes(q)) &&
                (tag === "" || (todoTags[todo.id] ?? []).includes(tag)),
            )
            .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt) || b.id - a.id);
        `,
      },
    },
    "/api/tags": {
      ...openApiDocument.paths?.["/api/tags"],
      get: {
        ...openApiDocument.paths?.["/api/tags"]?.get,
        "x-handler": `
          const query = (req.query.query ?? "").trim();
          // 本番と同じく、名前の昇順・同値ならID昇順で返す。
          return store
            .list("Tag")
            .filter((tag) => tag.name.includes(query))
            .sort((a, b) => a.name.localeCompare(b.name) || a.id - b.id);
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
