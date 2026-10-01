"use client";

import { useEffect, useRef, useState } from "react";
import { useMemoSearch } from "@/features/todo/context/memo-search-context";
import { useHeaderSearch } from "@/features/todo/hooks/use-header-search";
import HeaderSearch from "./header-search";

export default function HeaderSearchContainer() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const { status, memoResults, tagResults, retry } = useHeaderSearch(query, isOpen);
  const { requestOpenMemo, setTagFilter } = useMemoSearch();

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <HeaderSearch
      ref={rootRef}
      state={isOpen ? "Open" : "Idle"}
      query={query}
      status={status}
      memoResults={memoResults}
      tagResults={tagResults}
      onFocus={() => setIsOpen(true)}
      onRetry={retry}
      onSelectMemo={(id) => {
        requestOpenMemo(id);
        setIsOpen(false);
      }}
      onSelectTag={(tag) => {
        setTagFilter(tag);
        setIsOpen(false);
      }}
      onQueryChange={(value) => {
        setQuery(value);
        setIsOpen(true);
      }}
    />
  );
}
