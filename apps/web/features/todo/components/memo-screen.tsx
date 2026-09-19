"use client";

import { useRef, useState } from "react";

import type { components } from "@/lib/api/generated";
import MemoEditor from "./memo-editor";
import MemoList from "./memo-list";
import MemoWorkspace from "./memo-workspace";
import NewMemoButton from "./new-memo-button";

type MemoScreenProps = {
  memos: components["schemas"]["Todo"][];
};

type MemoDraft = Pick<components["schemas"]["Todo"], "title" | "body">;

export default function MemoScreen({ memos }: MemoScreenProps) {
  const [selectedId, setSelectedId] = useState<number | null>(memos[0]?.id ?? null);
  const [newMemos, setNewMemos] = useState<components["schemas"]["Todo"][]>([]);
  const nextLocalId = useRef(-1);
  const [focusTitleId, setFocusTitleId] = useState<number | null>(null);
  // 下書きはメモごとに画面内で保持する。APIへの保存は後続ステップで対応する。
  const [drafts, setDrafts] = useState<Partial<Record<number, MemoDraft>>>({});
  const allMemos = [...newMemos, ...memos];
  const previewMemos = allMemos.map((memo) => ({ ...memo, ...drafts[memo.id] }));
  const selectedMemo = allMemos.find((memo) => memo.id === selectedId);
  const draft = selectedMemo ? (drafts[selectedMemo.id] ?? selectedMemo) : null;

  function createMemo() {
    // モック用の一時ID。実APIのIDとは区別し、連続クリックでも重複させない。
    while (allMemos.some((memo) => memo.id === nextLocalId.current)) {
      nextLocalId.current -= 1;
    }
    const id = nextLocalId.current--;
    const memo = { id, title: "", body: "", createdAt: new Date().toISOString() };
    setNewMemos((previous) => [memo, ...previous]);
    setSelectedId(id);
    setFocusTitleId(id);
  }

  function selectMemo(id: number) {
    setSelectedId(id);
    setFocusTitleId(null);
  }

  function updateDraft(changes: Partial<MemoDraft>) {
    if (!selectedMemo) return;

    setDrafts((previous) => ({
      ...previous,
      [selectedMemo.id]: {
        title: selectedMemo.title,
        body: selectedMemo.body,
        ...previous[selectedMemo.id],
        ...changes,
      },
    }));
  }

  return (
    <MemoWorkspace
      action={<NewMemoButton onClick={createMemo} />}
      list={<MemoList memos={previewMemos} selectedId={selectedId} onSelect={selectMemo} />}
      editor={
        selectedMemo && draft ? (
          <MemoEditor
            key={selectedMemo.id}
            focusTitle={focusTitleId === selectedMemo.id}
            title={draft.title}
            body={draft.body}
            onTitleChange={(title) => updateDraft({ title })}
            onBodyChange={(body) => updateDraft({ body })}
          />
        ) : null
      }
    />
  );
}
