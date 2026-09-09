import { describe, expect, test } from "bun:test";

import { TodoCreateInput, TodoListSchema, TodoSchema, TodoUpdateInput } from "./todo";

describe("TodoSchema", () => {
  test("有効なTODOを受理する", () => {
    const result = TodoSchema.safeParse({
      id: 1,
      title: "買い物",
      body: "牛乳を買う",
    });

    expect(result.success).toBe(true);
  });

  test("idがないTODOを拒否する", () => {
    const result = TodoSchema.safeParse({
      title: "買い物",
      body: "牛乳を買う",
    });

    expect(result.success).toBe(false);
  });

  test("titleがないTODOを拒否する", () => {
    const result = TodoSchema.safeParse({
      id: 1,
      body: "牛乳を買う",
    });

    expect(result.success).toBe(false);
  });

  test("bodyが文字列でないTODOを拒否する", () => {
    const result = TodoSchema.safeParse({
      id: 1,
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
        id: 1,
        title: "買い物",
        body: "牛乳を買う",
      },
    ]);

    expect(result.success).toBe(true);
  });
});

describe("TodoCreateInput", () => {
  test("有効な作成入力を受理する", () => {
    const result = TodoCreateInput.safeParse({
      title: "買い物",
      body: "牛乳を買う",
    });

    expect(result.success).toBe(true);
  });

  test("titleがない作成入力を拒否する", () => {
    const result = TodoCreateInput.safeParse({
      body: "牛乳を買う",
    });

    expect(result.success).toBe(false);
  });

  test("bodyが文字列でない作成入力を拒否する", () => {
    const result = TodoCreateInput.safeParse({
      title: "買い物",
      body: 123,
    });

    expect(result.success).toBe(false);
  });
});

describe("TodoUpdateInput", () => {
  test("titleとbody両方を含む更新入力を受理する", () => {
    const result = TodoUpdateInput.safeParse({
      title: "買い物",
      body: "牛乳を買う",
    });

    expect(result.success).toBe(true);
  });

  test("titleのみの更新入力を受理する", () => {
    const result = TodoUpdateInput.safeParse({
      title: "買い物",
    });

    expect(result.success).toBe(true);
  });

  test("空オブジェクトの更新入力を受理する", () => {
    const result = TodoUpdateInput.safeParse({});

    expect(result.success).toBe(true);
  });

  test("bodyが文字列でない更新入力を拒否する", () => {
    const result = TodoUpdateInput.safeParse({
      body: 123,
    });

    expect(result.success).toBe(false);
  });
});
