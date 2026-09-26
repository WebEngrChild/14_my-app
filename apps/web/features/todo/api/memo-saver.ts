import type { MemoInput, MemoSaver } from "@/features/todo/autosave/types";
import { createTodo } from "./create-todo";
import { updateTodo } from "./update-todo";

type TodoApi = {
  create: (
    input: MemoInput,
    signal: AbortSignal,
  ) => Promise<{ data?: { id: number }; response: Response }>;
  update: (id: number, input: MemoInput, signal: AbortSignal) => Promise<{ response: Response }>;
};

/** 作成前の画面上の一時IDと、APIが発行したIDを対応付けて保存する。 */
export function createMemoSaver({
  create = createTodo,
  update = updateTodo,
}: Partial<TodoApi> = {}): MemoSaver {
  const createdIds = new Map<number, number>();

  const save: MemoSaver = async ({ localId, input, isNew, signal }) => {
    const serverId = createdIds.get(localId);
    if (isNew && serverId === undefined) {
      const { data, response } = await create(input, signal);
      if (!response.ok || !data || !Number.isInteger(data.id)) {
        throw new Error("メモの作成に失敗しました");
      }
      createdIds.set(localId, data.id);
      return;
    }

    const { response } = await update(serverId ?? localId, input, signal);
    if (!response.ok) throw new Error("メモの更新に失敗しました");
  };

  save.resolveId = (localId) => createdIds.get(localId);
  return save;
}
