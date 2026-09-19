import { env } from "@/env/client";
import type { MemoInput, MemoSaver } from "@/features/todo/autosave/types";
import { createTodo } from "./create-todo";
import { updateTodo } from "./update-todo";

// Scalarの固定レスポンス専用。実API接続時はこのアダプターを置き換える。
type MockApi = {
  baseUrl?: string;
  create: (
    input: MemoInput,
    signal: AbortSignal,
  ) => Promise<{ data?: { id: number }; response: Response }>;
  update: (id: number, input: MemoInput, signal: AbortSignal) => Promise<{ response: Response }>;
};

export function createMockMemoSaver({
  baseUrl = env.NEXT_PUBLIC_API_BASE_URL,
  create = createTodo,
  update = updateTodo,
}: Partial<MockApi> = {}): MemoSaver {
  const createdIds = new Map<number, number>();

  return async ({ localId, input, isNew, signal }) => {
    const url = baseUrl ? new URL(baseUrl) : null;
    if (!url || !["localhost", "127.0.0.1"].includes(url.hostname) || url.port !== "4010") {
      throw new Error("自動送信の接続先をローカルモック（4010）に設定してください");
    }

    const serverId = createdIds.get(localId);
    if (isNew && serverId === undefined) {
      const { data, response } = await create(input, signal);
      if (!response.ok || !data || !Number.isInteger(data.id)) {
        throw new Error("メモの作成に失敗しました");
      }
      createdIds.set(localId, data.id);
    } else {
      const { response } = await update(serverId ?? localId, input, signal);
      if (!response.ok) throw new Error("メモの更新に失敗しました");
    }
    // モックは同じID・サンプル本文を返すため、画面のID・下書きは上書きしない。
  };
}
