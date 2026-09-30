"use client";

import { useCallback, useEffect, useState } from "react";

import { getTags } from "@/features/todo/api/get-tags";
import { searchTodos } from "@/features/todo/api/search-todos";

const DEBOUNCE_MS = 300;
const SNIPPET_LENGTH = 60;

type Status = "Loading" | "Error" | "Success";
type MemoResult = { id: number; title: string; snippet: string };

export function useHeaderSearch(query: string, enabled: boolean) {
  const [status, setStatus] = useState<Status>("Success");
  const [memoResults, setMemoResults] = useState<MemoResult[]>([]);
  const [tagResults, setTagResults] = useState<string[]>([]);
  const [retryCount, setRetryCount] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: retryCountは再試行時に検索を再実行するためのトリガー
  useEffect(() => {
    const isTagMode = query.startsWith("#");
    const keyword = (isTagMode ? query.slice(1) : query).trim();

    // メモ検索は空入力では通信しない。
    if (!enabled || (!isTagMode && keyword === "")) {
      setMemoResults([]);
      setTagResults([]);
      setStatus("Success");
      return;
    }

    const controller = new AbortController();
    setStatus("Loading");

    const timer = setTimeout(async () => {
      try {
        if (isTagMode) {
          const { data, response } = await getTags(keyword, controller.signal);
          if (!response.ok || !data) throw new Error("tag search failed");
          if (controller.signal.aborted) return;
          setTagResults(data.map((tag) => tag.name));
        } else {
          const { data, response } = await searchTodos({ q: keyword }, controller.signal);
          if (!response.ok || !data) throw new Error("memo search failed");
          if (controller.signal.aborted) return;
          setMemoResults(
            data.map((todo) => ({
              id: todo.id,
              title: todo.title,
              snippet: todo.body.slice(0, SNIPPET_LENGTH),
            })),
          );
        }
        setStatus("Success");
      } catch {
        if (!controller.signal.aborted) setStatus("Error");
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, enabled, retryCount]);

  const retry = useCallback(() => setRetryCount((count) => count + 1), []);

  return { status, memoResults, tagResults, retry };
}
