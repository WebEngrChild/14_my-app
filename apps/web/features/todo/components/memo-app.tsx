"use client";

import { useMemo } from "react";

import { createMockMemoSaver } from "@/features/todo/api/mock-memo-saver";
import { useTodos } from "@/features/todo/hooks/use-todos";
import MemoScreen from "./memo-screen";
import MemoStatusMessage from "./memo-status-message";
import MemoWorkspace from "./memo-workspace";

export default function MemoApp() {
  const { todos, isLoading, error, reload } = useTodos();
  const saveMemo = useMemo(() => createMockMemoSaver(), []);

  if (isLoading) {
    return <MemoWorkspace list={<MemoStatusMessage message="読み込み中…" />} />;
  }

  if (error) {
    return (
      <MemoWorkspace
        list={
          <MemoStatusMessage
            role="alert"
            message={error}
            hint="通信環境を確認して、もう一度お試しください。"
            action={
              <button
                type="button"
                onClick={reload}
                className="mt-1 rounded px-2 py-1 text-[13px] text-[#111] underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                再読み込み
              </button>
            }
          />
        }
      />
    );
  }

  return <MemoScreen memos={todos} saveMemo={saveMemo} />;
}
