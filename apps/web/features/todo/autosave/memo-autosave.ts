import type { MemoInput, MemoSaver, SaveStatus } from "./types";

type Entry = {
  input: MemoInput;
  isNew: boolean;
  revision: number;
  status: SaveStatus;
  cancelTimer?: () => void;
  ready: boolean;
  controller?: AbortController;
};

type Options = {
  save: MemoSaver;
  onStatus: (id: number, status: SaveStatus) => void;
  // テストでは仮想時計を使い、800msの待機と競合を再現する。
  delay?: (callback: () => void, ms: number) => () => void;
};

export function createMemoAutosave({ save, onStatus, delay = startTimer }: Options) {
  const entries = new Map<number, Entry>();
  let disposed = false;

  function status(id: number, entry: Entry, next: SaveStatus) {
    entry.status = next;
    if (!disposed) onStatus(id, next);
  }

  async function send(id: number, entry: Entry) {
    if (disposed || entry.controller || !entry.ready) return;
    entry.ready = false;
    const revision = entry.revision;
    const controller = new AbortController();
    entry.controller = controller;
    status(id, entry, "saving");

    try {
      await save({
        localId: id,
        input: { ...entry.input },
        isNew: entry.isNew,
        signal: controller.signal,
      });
      if (disposed) return;
      entry.controller = undefined;
      if (entry.revision === revision) {
        status(id, entry, "success");
      } else {
        status(id, entry, "pending");
        // 待機時間が通信中に経過した場合だけ、最新の入力を続けて送る。
        if (entry.ready) void send(id, entry);
      }
    } catch {
      if (disposed) return;
      entry.controller = undefined;
      entry.cancelTimer?.();
      entry.cancelTimer = undefined;
      entry.ready = false;
      status(id, entry, "error");
    }
  }

  function schedule(id: number, input: MemoInput, isNew = false) {
    if (disposed) return;
    const entry = entries.get(id) ?? { input, isNew, revision: 0, status: "idle", ready: false };
    entries.set(id, entry);
    entry.input = { ...input };
    entry.revision += 1;
    entry.cancelTimer?.();
    entry.ready = false;
    status(id, entry, entry.controller ? "saving" : "pending");
    entry.cancelTimer = delay(() => {
      entry.cancelTimer = undefined;
      entry.ready = true;
      void send(id, entry);
    }, 800);
  }

  function retry(id: number) {
    const entry = entries.get(id);
    if (disposed || !entry || entry.controller) return;
    entry.cancelTimer?.();
    entry.cancelTimer = undefined;
    entry.ready = true;
    void send(id, entry);
  }

  function dispose() {
    disposed = true;
    for (const entry of entries.values()) {
      entry.cancelTimer?.();
      entry.controller?.abort();
    }
    entries.clear();
  }

  return { schedule, retry, dispose };
}

function startTimer(callback: () => void, ms: number) {
  const timer = setTimeout(callback, ms);
  return () => clearTimeout(timer);
}
