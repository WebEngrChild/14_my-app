"use client";

import { useState } from "react";

import type { components } from "@/lib/api/generated";
import MemoEditor from "./memo-editor";
import MemoList from "./memo-list";
import MemoWorkspace from "./memo-workspace";
import NewMemoButton from "./new-memo-button";

type MemoScreenProps = {
  memos: components["schemas"]["Todo"][];
};

export default function MemoScreen({ memos }: MemoScreenProps) {
  const [selectedId, setSelectedId] = useState<number | null>(memos[0]?.id ?? null);
  // 編集領域の確認用。選択との連動・一覧への反映は後続ステップで対応する。
  const [title, setTitle] = useState(memos[0]?.title ?? "");
  const [body, setBody] = useState(memos[0]?.body ?? "");

  return (
    <MemoWorkspace
      action={<NewMemoButton />}
      list={<MemoList memos={memos} selectedId={selectedId} onSelect={setSelectedId} />}
      editor={
        memos.length > 0 ? (
          <MemoEditor title={title} body={body} onTitleChange={setTitle} onBodyChange={setBody} />
        ) : null
      }
    />
  );
}
