import { describe, expect, test } from "bun:test";

import { createMemoAutosave } from "./memo-autosave";
import type { MemoSaver, SaveStates } from "./types";

function createClock() {
  let now = 0;
  const timers = new Set<{ at: number; callback: () => void }>();
  return {
    delay(callback: () => void, ms: number) {
      const timer = { at: now + ms, callback };
      timers.add(timer);
      return () => {
        timers.delete(timer);
      };
    },
    advance(ms: number) {
      now += ms;
      for (const timer of [...timers]) {
        if (timer.at <= now) {
          timers.delete(timer);
          timer.callback();
        }
      }
    },
  };
}

function deferred() {
  let resolve!: () => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<void>((ok, fail) => {
    resolve = ok;
    reject = fail;
  });
  return { promise, resolve, reject };
}

function setup() {
  const clock = createClock();
  const states: SaveStates = {};
  const calls: Array<{ request: Parameters<MemoSaver>[0]; result: ReturnType<typeof deferred> }> =
    [];
  const queue = createMemoAutosave({
    delay: clock.delay,
    onStatus: (id, state) => {
      states[id] = state;
    },
    save: (request) => {
      const result = deferred();
      calls.push({ request, result });
      return result.promise;
    },
  });
  return { queue, clock, calls, states };
}

describe("メモの自動送信", () => {
  test("最後の入力から800ms待ち、最新の内容を1回だけ送る", async () => {
    const { queue, clock, calls, states } = setup();
    queue.schedule(1, { title: "古い", body: "" });
    clock.advance(600);
    queue.schedule(1, { title: "新しい", body: "本文" });
    clock.advance(799);
    expect(calls).toHaveLength(0);
    expect(states[1]).toBe("pending");
    clock.advance(1);
    expect(calls).toHaveLength(1);
    expect(calls[0].request.input).toEqual({ title: "新しい", body: "本文" });
    expect(states[1]).toBe("saving");
    calls[0].result.resolve();
    await Promise.resolve();
    expect(states[1]).toBe("success");
    queue.dispose();
  });

  test("同じメモは直列送信し、通信中の複数編集は最新の内容にまとめる", async () => {
    const { queue, clock, calls, states } = setup();
    queue.schedule(1, { title: "最初", body: "" });
    clock.advance(800);
    queue.schedule(1, { title: "途中", body: "" });
    queue.schedule(1, { title: "最後", body: "更新本文" });
    clock.advance(800);
    expect(calls).toHaveLength(1);
    calls[0].result.resolve();
    await Promise.resolve();
    expect(calls).toHaveLength(2);
    expect(calls[0].request.input.title).toBe("最初");
    expect(calls[1].request.input).toEqual({ title: "最後", body: "更新本文" });
    expect(states[1]).toBe("saving");
    calls[1].result.resolve();
    await Promise.resolve();
    expect(states[1]).toBe("success");
    queue.dispose();
  });

  test("通信完了時に最新入力の800ms待機が残っていれば待つ", async () => {
    const { queue, clock, calls, states } = setup();
    queue.schedule(1, { title: "最初", body: "" });
    clock.advance(800);
    queue.schedule(1, { title: "次", body: "" });
    calls[0].result.resolve();
    await Promise.resolve();
    expect(states[1]).toBe("pending");
    clock.advance(799);
    expect(calls).toHaveLength(1);
    clock.advance(1);
    expect(calls).toHaveLength(2);
    queue.dispose();
  });

  test("別のメモの予約で送信が取り消されたり内容が混ざったりしない", () => {
    const { queue, clock, calls } = setup();
    queue.schedule(1, { title: "メモ1", body: "本文1" });
    clock.advance(400);
    queue.schedule(2, { title: "メモ2", body: "本文2" });
    clock.advance(400);
    expect(calls[0].request.localId).toBe(1);
    expect(calls[0].request.input.body).toBe("本文1");
    clock.advance(400);
    expect(calls[1].request.localId).toBe(2);
    expect(calls[1].request.input.body).toBe("本文2");
    queue.dispose();
  });

  test("失敗時に自動で繰り返さず、再試行は最新の下書きを送る", async () => {
    const { queue, clock, calls, states } = setup();
    queue.schedule(1, { title: "最初", body: "" });
    clock.advance(800);
    queue.schedule(1, { title: "変更後", body: "" });
    calls[0].result.reject(new Error("offline"));
    await Promise.resolve();
    expect(states[1]).toBe("error");
    clock.advance(5000);
    expect(calls).toHaveLength(1);
    queue.retry(1);
    queue.retry(1);
    expect(calls).toHaveLength(2);
    expect(calls[1].request.input.title).toBe("変更後");
    calls[1].result.resolve();
    await Promise.resolve();
    expect(states[1]).toBe("success");
    queue.dispose();
  });

  test("失敗後の編集で新しい送信を予約できる", async () => {
    const { queue, clock, calls } = setup();
    queue.schedule(1, { title: "最初", body: "" });
    clock.advance(800);
    calls[0].result.reject(new Error("offline"));
    await Promise.resolve();
    queue.schedule(1, { title: "", body: "" });
    clock.advance(800);
    expect(calls[1].request.input).toEqual({ title: "", body: "" });
    queue.dispose();
  });

  test("新規メモの作成予約も入力で更新できる", () => {
    const { queue, clock, calls } = setup();
    queue.schedule(-1, { title: "", body: "" }, true);
    clock.advance(400);
    queue.schedule(-1, { title: "新規", body: "本文" }, true);
    clock.advance(800);
    expect(calls).toHaveLength(1);
    expect(calls[0].request.isNew).toBe(true);
    expect(calls[0].request.input.title).toBe("新規");
    queue.dispose();
  });

  test("画面終了時は待機と通信を中断し、後から状態更新しない", async () => {
    const { queue, clock, calls, states } = setup();
    queue.schedule(1, { title: "送信中", body: "" });
    clock.advance(800);
    queue.schedule(2, { title: "待機中", body: "" });
    queue.dispose();
    expect(calls[0].request.signal.aborted).toBe(true);
    clock.advance(800);
    calls[0].result.resolve();
    await Promise.resolve();
    expect(calls).toHaveLength(1);
    expect(states[1]).toBe("saving");
    queue.retry(1);
    queue.schedule(3, { title: "終了後", body: "" });
    clock.advance(800);
    expect(calls).toHaveLength(1);
  });
});
