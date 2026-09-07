import { describe, expect, test } from "bun:test";

import { TodoListSchema, TodoSchema } from "./todo";

describe("TodoSchema", () => {
  test("有効なTODOを受理する", () => {
    const result = TodoSchema.safeParse({
      title: "買い物",
      body: "牛乳を買う",
    });

    expect(result.success).toBe(true);
  });

  test("titleがないTODOを拒否する", () => {
    const result = TodoSchema.safeParse({
      body: "牛乳を買う",
    });

    expect(result.success).toBe(false);
  });

  test("bodyが文字列でないTODOを拒否する", () => {
    const result = TodoSchema.safeParse({
      title: "買い物",
      body: 123,
    });

    expect(result.success).toBe(false);
  });
});

describe("TodoListSchema", () => {
  test("TODOの配列を受理する", () => {
    const result = TodoListSchema.safeParse([
      {
        title: "買い物",
        body: "牛乳を買う",
      },
    ]);

    expect(result.success).toBe(true);
  });
});
