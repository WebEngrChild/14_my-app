"use client";

import { useTodos } from "@/features/todo/hooks/use-todos";
import MemoScreen from "./memo-screen";
import MemoWorkspace from "./memo-workspace";

export default function MemoApp() {
  const { todos, isLoading, error } = useTodos();

  if (isLoading) {
    return (
      <MemoWorkspace
        list={
          <p role="status" className="p-5 text-sm text-[#666]">
            読み込み中…
          </p>
        }
      />
    );
  }

  if (error) {
    return (
      <MemoWorkspace
        list={
          <p role="alert" className="p-5 text-sm text-[#666]">
            {error}
          </p>
        }
      />
    );
  }

  return <MemoScreen memos={todos} />;
}
