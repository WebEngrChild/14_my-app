import type { components } from "@/lib/api/generated";

import MemoListItem from "./memo-list-item";

type MemoListProps = {
  memos: components["schemas"]["Todo"][];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export default function MemoList({ memos, selectedId, onSelect }: MemoListProps) {
  return (
    <ul>
      {memos.map((memo) => (
        <li key={memo.id}>
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
