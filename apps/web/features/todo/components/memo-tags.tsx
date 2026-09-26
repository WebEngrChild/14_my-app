"use client";

import { useEffect, useRef, useState } from "react";

import type { components } from "@/lib/api/generated";
import { createTag } from "../api/create-tag";
import { getTags } from "../api/get-tags";
import TagComposer from "./tag-composer";

type Tag = components["schemas"]["Tag"];

type MemoTagsProps = {
  tags: Tag[];
  onSelect: (tag: Tag) => Promise<void>;
  onDetach: (tag: Tag) => Promise<void>;
};

export default function MemoTags({ tags, onSelect, onDetach }: MemoTagsProps) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<{ query: string; tags: Tag[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const savingRef = useRef(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: revisionは明示的な再読み込みのための依存値。
  useEffect(() => {
    const controller = new AbortController();
    setResult(null);
    setError(null);

    async function load() {
      try {
        const { data, response } = await getTags(query.trim(), controller.signal);
        if (!response.ok || !data) throw new Error();
        if (!controller.signal.aborted) setResult({ query, tags: data });
      } catch {
        if (!controller.signal.aborted) {
          setError("タグ候補の取得に失敗しました。");
        }
      }
    }

    void load();
    return () => controller.abort();
  }, [query, revision]);

  const ready = result?.query === query;
  const matches = ready ? result.tags : [];
  const candidates = matches.filter((tag) => !tags.some((selected) => selected.id === tag.id));
  const suggestions = [...new Set(candidates.map((tag) => tag.name))];
  const state =
    !query.trim() || !ready || error ? "Idle" : matches.length > 0 ? "Matching" : "NoMatch";

  function reload() {
    setResult(null);
    setError(null);
    setRevision((value) => value + 1);
  }

  async function mutate(action: () => Promise<void>) {
    if (savingRef.current) return;
    savingRef.current = true;
    setIsSaving(true);
    setError(null);
    try {
      await action();
      setQuery("");
      reload();
    } catch {
      setError("タグの変更に失敗しました。もう一度お試しください。");
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  }

  return (
    <section aria-label="メモのタグ" className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        {tags.map((tag) => (
          <span
            key={tag.id}
            className="flex items-center gap-2 rounded-md bg-[#f5f5f7] px-3 py-2 text-sm"
          >
            #{tag.name}
            <button
              type="button"
              aria-label={`このメモからタグ「${tag.name}」を外す`}
              disabled={isSaving}
              className="rounded px-1 text-xs underline disabled:opacity-50"
              onClick={() => {
                void mutate(async () => {
                  await onDetach(tag);
                });
              }}
            >
              このメモから外す
            </button>
          </span>
        ))}
        <TagComposer
          state={state}
          query={query}
          suggestions={suggestions}
          disabled={isSaving}
          onQueryChange={setQuery}
          onSelect={(name) => {
            const tag = candidates.find((candidate) => candidate.name === name);
            if (tag) {
              void mutate(async () => {
                await onSelect(tag);
                setQuery("");
              });
            }
          }}
          onCreate={() => {
            if (state !== "NoMatch") return;
            void mutate(async () => {
              const { data, response } = await createTag({ name: query.trim() });
              if (!response.ok || !data) throw new Error();
              await onSelect(data);
            });
          }}
        />
      </div>
      {!ready && !error ? <p role="status">タグ候補を読み込み中…</p> : null}
      {isSaving ? <p role="status">タグを更新中…</p> : null}
      {error ? (
        <div role="alert" className="text-sm text-red-700">
          <p>{error}</p>
          <button type="button" disabled={isSaving} onClick={reload} className="mt-1 underline">
            タグ候補を再読み込み
          </button>
        </div>
      ) : null}
    </section>
  );
}
