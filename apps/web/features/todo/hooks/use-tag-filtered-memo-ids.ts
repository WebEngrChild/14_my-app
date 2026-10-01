import { useEffect, useState } from "react";

import { searchTodos } from "../api/search-todos";

type Status = "Loading" | "Error" | "Success";

// タグ絞り込み中、そのタグが付いたメモのIDを取得する。tagがnullなら絞り込みなし(ids: null)。
export function useTagFilteredMemoIds(tag: string | null) {
  const [ids, setIds] = useState<Set<number> | null>(null);
  const [status, setStatus] = useState<Status>("Success");
  const [retryCount, setRetryCount] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: retryCountの変化で再取得するためのトリガー
  useEffect(() => {
    if (tag === null) {
      setIds(null);
      setStatus("Success");
      return;
    }

    const controller = new AbortController();
    setStatus("Loading");
    void searchTodos({ tag }, controller.signal)
      .then(({ data, response }) => {
        if (controller.signal.aborted) return;
        if (!response.ok || !data) throw new Error();
        setIds(new Set(data.map((todo) => todo.id)));
        setStatus("Success");
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus("Error");
      });
    return () => controller.abort();
  }, [tag, retryCount]);

  return { ids, status, retry: () => setRetryCount((count) => count + 1) };
}
