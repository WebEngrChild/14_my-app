"use client";

import { useRef, useState } from "react";

import type { components } from "@/lib/api/generated";
import type { MemoSaver } from "../autosave/types";
import { useMemoAutosave } from "../hooks/use-memo-autosave";
import MemoEditor from "./memo-editor";
import MemoList from "./memo-list";
import MemoSaveStatus from "./memo-save-status";
import MemoStatusMessage from "./memo-status-message";
import MemoWorkspace from "./memo-workspace";
import NewMemoButton from "./new-memo-button";

type MemoScreenProps = {
  memos: components["schemas"]["Todo"][];
  saveMemo?: MemoSaver;
};

type MemoDraft = Pick<components["schemas"]["Todo"], "title" | "body">;

export default function MemoScreen({ memos, saveMemo }: MemoScreenProps) {
  const { scheduleSave, retrySave, saveStates } = useMemoAutosave(saveMemo);
  const [selectedId, setSelectedId] = useState<number | null>(memos[0]?.id ?? null);
  const [newMemos, setNewMemos] = useState<components["schemas"]["Todo"][]>([]);
  const nextLocalId = useRef(-1);
  const [focusTitleId, setFocusTitleId] = useState<number | null>(null);
  // 固定レスポンスで入力内容を上書きせず、モック送信後も画面内の下書きを保持する。
  const [drafts, setDrafts] = useState<Partial<Record<number, MemoDraft>>>({});
  const allMemos = [...newMemos, ...memos];
  const previewMemos = allMemos.map((memo) => ({ ...memo, ...drafts[memo.id] }));
  // 一覧が入れ替わっても下書きを失わないよう選択はIDで保持し、消えたときだけ先頭に戻す。
  const selectedMemo = allMemos.find((memo) => memo.id === selectedId) ?? allMemos[0] ?? null;
  const activeId = selectedMemo?.id ?? null;
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
    scheduleSave(id, { title: "", body: "" }, true);
  }

  function selectMemo(id: number) {
    setSelectedId(id);
    setFocusTitleId(null);
  }

  function updateDraft(changes: Partial<MemoDraft>) {
    if (!selectedMemo) return;

    const nextDraft = {
      title: selectedMemo.title,
      body: selectedMemo.body,
      ...drafts[selectedMemo.id],
      ...changes,
    };
    setDrafts((previous) => ({
      ...previous,
      [selectedMemo.id]: nextDraft,
    }));
    scheduleSave(
      selectedMemo.id,
      nextDraft,
      newMemos.some((memo) => memo.id === selectedMemo.id),
    );
  }

  return (
    <MemoWorkspace
      status={
        saveMemo ? (
          <MemoSaveStatus
            status={activeId === null ? "idle" : (saveStates[activeId] ?? "idle")}
            onRetry={() => {
              if (activeId !== null) retrySave(activeId);
            }}
            hasErrors={Object.values(saveStates).includes("error")}
          />
        ) : undefined
      }
      action={<NewMemoButton onClick={createMemo} />}
      list={
        previewMemos.length === 0 ? (
          <MemoStatusMessage
            message="メモがありません"
            hint="右下の「＋」から新しいメモを作成できます。"
          />
        ) : (
          <MemoList memos={previewMemos} selectedId={activeId} onSelect={selectMemo} />
        )
      }
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
        ) : (
          <MemoStatusMessage message="編集するメモを選択してください" />
        )
      }
    />
  );
}
