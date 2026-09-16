import { describe, expect, test } from "bun:test";

import { TodoCreateInput, TodoListSchema, TodoSchema, TodoUpdateInput } from "./todo";

describe("TodoSchema", () => {
  test("有効なTODOを受理する", () => {
    const result = TodoSchema.safeParse({
      id: 1,
      title: "買い物",
      body: "牛乳を買う",
      createdAt: "2026-09-15T18:15:00+09:00",
    });

    expect(result.success).toBe(true);
  });

  test("作成日時がないレスポンスを拒否する", () => {
    expect(TodoSchema.safeParse({ id: 1, title: "買い物", body: "牛乳を買う" }).success).toBe(
      false,
    );
  });

  test("UTCの作成日時を受理する", () => {
    expect(
      TodoSchema.safeParse({
        id: 1,
        title: "買い物",
        body: "牛乳を買う",
        createdAt: "2026-09-15T09:15:00Z",
      }).success,
    ).toBe(true);
  });

  test("不正な日時とタイムゾーンのない日時を拒否する", () => {
    for (const createdAt of ["invalid", "2026-09-15", "2026-09-15T18:15:00"]) {
      expect(
        TodoSchema.safeParse({ id: 1, title: "買い物", body: "牛乳を買う", createdAt }).success,
      ).toBe(false);
    }
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
        createdAt: "2026-09-15T18:15:00+09:00",
      },
    ]);

    expect(result.success).toBe(true);
  });
});

describe("TodoCreateInput", () => {
  test("ID・作成日時・未知の項目を作成データから除外する", () => {
    expect(
      TodoCreateInput.parse({
        id: 99,
        title: "買い物",
        body: "牛乳を買う",
        createdAt: "2026-09-15T09:15:00Z",
        extra: "ignored",
      }),
    ).toEqual({ title: "買い物", body: "牛乳を買う" });
  });

  test("bodyがない作成入力を拒否する", () => {
    expect(TodoCreateInput.safeParse({ title: "買い物" }).success).toBe(false);
  });

  test("空のタイトルと本文で新規メモを作成できる", () => {
    expect(TodoCreateInput.parse({ title: "", body: "" })).toEqual({ title: "", body: "" });
  });

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
  test("本文だけの更新では未指定のタイトルを補わない", () => {
    expect(TodoUpdateInput.parse({ body: "パンを買う" })).toEqual({ body: "パンを買う" });
  });

  test("ID・作成日時・未知の項目を更新データから除外する", () => {
    expect(
      TodoUpdateInput.parse({
        id: 99,
        body: "パンを買う",
        createdAt: "2026-09-15T09:15:00Z",
        extra: "ignored",
      }),
    ).toEqual({ body: "パンを買う" });
  });

  test("タイトルと本文を空文字に更新できる", () => {
    expect(TodoUpdateInput.parse({ title: "", body: "" })).toEqual({ title: "", body: "" });
  });

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
