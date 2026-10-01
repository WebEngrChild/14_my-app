type MemoTagFilterChipProps = {
  tag: string;
  onClear: () => void;
};

export default function MemoTagFilterChip({ tag, onClear }: MemoTagFilterChipProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 text-sm">
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1">
        #{tag}
        <button type="button" aria-label={`#${tag} の絞り込みを解除`} onClick={onClear}>
          ✕
        </button>
      </span>
    </div>
  );
}
