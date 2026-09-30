import { useEffect, useRef } from "react";

import type { components } from "@/lib/api/generated";

import MemoListItem from "./memo-list-item";

type MemoListProps = {
  memos: components["schemas"]["Todo"][];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export default function MemoList({ memos, selectedId, onSelect }: MemoListProps) {
  const selectedRef = useRef<HTMLLIElement>(null);

  // 検索などで選択が変わったとき、選択中のメモが見える位置までスクロールする。
  // biome-ignore lint/correctness/useExhaustiveDependencies: selectedIdの変化を検知して実行するためのトリガー
  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: "nearest" });
  }, [selectedId]);

  return (
    <ul>
      {memos.map((memo) => (
        <li key={memo.id} ref={memo.id === selectedId ? selectedRef : undefined}>
          <MemoListItem
            memo={memo}
            selected={memo.id === selectedId}
            onSelect={() => onSelect(memo.id)}
          />
        </li>
      ))}
    </ul>
  );
}
