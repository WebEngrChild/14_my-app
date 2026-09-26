import { describe, expect, test } from "bun:test";

import { createMemoSaver } from "./memo-saver";

const input = { title: "入力したタイトル", body: "入力した本文" };
const signal = new AbortController().signal;

describe("API経由の自動保存", () => {
  test("POSTの返却IDを後続PATCHに使い、画面IDごとに作成済みを管理する", async () => {
    const events: unknown[] = [];
    const save = createMemoSaver({
      create: async (body) => {
        events.push(["POST", body]);
        return { data: { id: 1 }, response: new Response(null, { status: 201 }) };
      },
      update: async (id, body) => {
        events.push(["PATCH", id, body]);
        return { response: new Response(null, { status: 200 }) };
      },
    });
    await save({ localId: -1, input, isNew: true, signal });
    expect(save.resolveId?.(-1)).toBe(1);
    await save({ localId: -1, input: { ...input, title: "更新" }, isNew: true, signal });
    await save({ localId: -2, input, isNew: true, signal });
    await save({ localId: 2, input, isNew: false, signal });
    expect(events).toEqual([
      ["POST", input],
      ["PATCH", 1, { ...input, title: "更新" }],
      ["POST", input],
      ["PATCH", 2, input],
    ]);
  });

  test("作成失敗時にはIDを登録せず、再試行でもPOSTする", async () => {
    let attempts = 0;
    const save = createMemoSaver({
      create: async () => {
        attempts += 1;
        return attempts === 1
          ? { response: new Response(null, { status: 500 }) }
          : { data: { id: 1 }, response: new Response(null, { status: 201 }) };
      },
      update: async () => {
        throw new Error("PATCHしてはいけない");
      },
    });
    const request = { localId: -1, input, isNew: true, signal };
    await expect(save(request)).rejects.toThrow("作成に失敗");
    expect(save.resolveId?.(-1)).toBeUndefined();
    await save(request);
    expect(save.resolveId?.(-1)).toBe(1);
    expect(attempts).toBe(2);
  });

  test("HTTPエラーと不正な作成レスポンスを成功扱いにしない", async () => {
    const save = createMemoSaver({
      create: async () => ({ response: new Response(null, { status: 201 }) }),
      update: async () => ({ response: new Response(null, { status: 404 }) }),
    });
    await expect(save({ localId: -1, input, isNew: true, signal })).rejects.toThrow();
    await expect(save({ localId: 1, input, isNew: false, signal })).rejects.toThrow();
  });
});
