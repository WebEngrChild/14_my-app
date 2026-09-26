"use client";

import { useRef, useState } from "react";

import type { components } from "@/lib/api/generated";
import type { MemoSaver } from "../autosave/types";
import { useMemoAutosave } from "../hooks/use-memo-autosave";
import MemoEditor from "./memo-editor";
import MemoList from "./memo-list";
import MemoSaveErrorNotice from "./memo-save-error-notice";
import MemoSaveStatus from "./memo-save-status";
import MemoStatusMessage from "./memo-status-message";
import MemoTags from "./memo-tags";
import MemoWorkspace from "./memo-workspace";
import NewMemoButton from "./new-memo-button";

type MemoScreenProps = {
  memos: components["schemas"]["Todo"][];
  saveMemo?: MemoSaver;
  enableTags?: boolean;
};

type MemoDraft = Pick<components["schemas"]["Todo"], "title" | "body"> & { updatedAt: string };

// DBの orderBy(desc(updatedAt), desc(id)) と同じ並びをフロントでも再現する。
function byUpdatedAtDesc(a: components["schemas"]["Todo"], b: components["schemas"]["Todo"]) {
  if (a.updatedAt !== b.updatedAt) return a.updatedAt < b.updatedAt ? 1 : -1;
  return b.id - a.id;
}

export default function MemoScreen({ memos, saveMemo, enableTags = false }: MemoScreenProps) {
  const [tagsByMemo, setTagsByMemo] = useState<
    Partial<Record<number, components["schemas"]["Tag"][]>>
  >({});
  const { scheduleSave, retrySave, saveStates } = useMemoAutosave(saveMemo);
  const [selectedId, setSelectedId] = useState<number | null>(memos[0]?.id ?? null);
  const [newMemos, setNewMemos] = useState<components["schemas"]["Todo"][]>([]);
  const nextLocalId = useRef(-1);
  const [focusTitleId, setFocusTitleId] = useState<number | null>(null);
  // スマホは1カラムで一覧と編集を行き来する。PCでは md: 側の指定が勝つため影響しない。
  const [mobileView, setMobileView] = useState<"list" | "editor">("list");
  // 保存レスポンスで入力内容を上書きせず、画面内の下書きを保持する。
  const [drafts, setDrafts] = useState<Partial<Record<number, MemoDraft>>>({});
  const allMemos = [...newMemos, ...memos];
  const previewMemos = allMemos
    .map((memo) => ({ ...memo, ...drafts[memo.id] }))
    .sort(byUpdatedAtDesc);
  // 一覧が入れ替わっても下書きを失わないよう選択はIDで保持し、消えたときだけ先頭に戻す。
  const selectedMemo = allMemos.find((memo) => memo.id === selectedId) ?? allMemos[0] ?? null;
  const activeId = selectedMemo?.id ?? null;
  const draft = selectedMemo ? (drafts[selectedMemo.id] ?? selectedMemo) : null;
  const failedIds = allMemos.map((memo) => memo.id).filter((id) => saveStates[id] === "error");

  function createMemo() {
    // 作成完了前の一時ID。実APIのIDとは区別し、連続クリックでも重複させない。
    while (allMemos.some((memo) => memo.id === nextLocalId.current)) {
      nextLocalId.current -= 1;
    }
    const id = nextLocalId.current--;
    const now = new Date().toISOString();
    const memo = { id, title: "", body: "", createdAt: now, updatedAt: now };
    setNewMemos((previous) => [memo, ...previous]);
    setSelectedId(id);
    setFocusTitleId(id);
    setMobileView("editor");
    scheduleSave(id, { title: "", body: "" }, true);
  }

  function selectMemo(id: number) {
    setSelectedId(id);
    setFocusTitleId(null);
    setMobileView("editor");
  }

  function updateDraft(changes: Partial<MemoDraft>) {
    if (!selectedMemo) return;

    const nextDraft = {
      title: selectedMemo.title,
      body: selectedMemo.body,
      ...drafts[selectedMemo.id],
      ...changes,
      updatedAt: new Date().toISOString(),
    };
    setDrafts((previous) => ({
      ...previous,
      [selectedMemo.id]: nextDraft,
    }));
    scheduleSave(
      selectedMemo.id,
      { title: nextDraft.title, body: nextDraft.body },
      newMemos.some((memo) => memo.id === selectedMemo.id),
    );
  }

  return (
    <MemoWorkspace
      mobileView={mobileView}
      onBack={() => setMobileView("list")}
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
        <>
          {failedIds.length > 0 ? (
            <MemoSaveErrorNotice count={failedIds.length} onOpen={() => selectMemo(failedIds[0])} />
          ) : null}
          {previewMemos.length === 0 ? (
            <MemoStatusMessage
              message="メモがありません"
              hint="右下の「＋」から新しいメモを作成できます。"
            />
          ) : (
            <MemoList memos={previewMemos} selectedId={activeId} onSelect={selectMemo} />
          )}
        </>
      }
      editor={
        selectedMemo && draft ? (
          <MemoEditor
            key={selectedMemo.id}
            tags={
              enableTags ? (
                <MemoTags
                  tags={tagsByMemo[selectedMemo.id] ?? []}
                  onSelect={(tag) => {
                    const memoId = selectedMemo.id;
                    setTagsByMemo((previous) => {
                      const tags = previous[memoId] ?? [];
                      if (tags.some((item) => item.id === tag.id)) return previous;
                      return { ...previous, [memoId]: [...tags, tag] };
                    });
                  }}
                  onDelete={(id) => {
                    setTagsByMemo((previous) =>
                      Object.fromEntries(
                        Object.entries(previous).map(([memoId, tags]) => [
                          memoId,
                          (tags ?? []).filter((tag) => tag.id !== id),
                        ]),
                      ),
                    );
                  }}
                />
              ) : undefined
            }
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
