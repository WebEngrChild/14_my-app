"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { createMemoAutosave } from "../autosave/memo-autosave";
import type { MemoInput, MemoSaver, SaveStates } from "../autosave/types";

export function useMemoAutosave(save?: MemoSaver) {
  const [saveStates, setSaveStates] = useState<SaveStates>({});
  const queue = useRef<ReturnType<typeof createMemoAutosave> | null>(null);

  useEffect(() => {
    if (!save) return;
    const instance = createMemoAutosave({
      save,
      onStatus: (id, status) => setSaveStates((previous) => ({ ...previous, [id]: status })),
    });
    queue.current = instance;
    return () => {
      instance.dispose();
      queue.current = null;
    };
  }, [save]);

  const scheduleSave = useCallback((id: number, input: MemoInput, isNew = false) => {
    queue.current?.schedule(id, input, isNew);
  }, []);
  const retrySave = useCallback((id: number) => queue.current?.retry(id), []);

  return { scheduleSave, retrySave, saveStates };
}
