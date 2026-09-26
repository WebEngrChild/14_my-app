import { forwardRef } from "react";

type TagComposerProps = {
  state?: "Idle" | "Open";
  query?: string;
  suggestions?: string[];
  canCreate?: boolean;
  disabled?: boolean;
  onQueryChange?: (query: string) => void;
  onSelect?: (name: string) => void;
  onCreate?: () => void;
  onRemoveLast?: () => void;
};

const TagComposer = forwardRef<HTMLInputElement, TagComposerProps>(function TagComposer(
  {
    state = "Idle",
    query = "",
    suggestions = [],
    canCreate = false,
    disabled = false,
    onQueryChange,
    onSelect,
    onCreate,
    onRemoveLast,
  },
  ref,
) {
  if (state === "Idle" && !onQueryChange) {
    return <div className="h-[37px] w-6" />;
  }

  // 既存タグの候補選択と、まだ存在しない名前の新規作成は独立した選択肢のため、両方同時に出しうる。
  const candidateLabels =
    state === "Idle"
      ? []
      : [
          ...suggestions.map((suggestion) => `#${suggestion}`),
          ...(canCreate && query.trim() ? [`+ #${query.trim()}`] : []),
        ];

  return (
    <div className="relative flex h-[37px] w-max min-w-16 items-center justify-center px-[5px]">
      <div className="w-max min-w-[54px] whitespace-nowrap">
        {onQueryChange ? (
          <input
            ref={ref}
            aria-label="タグを入力"
            type="text"
            value={query}
            disabled={disabled}
            placeholder="タグを追加"
            onChange={(event) => onQueryChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Backspace" && query === "") {
                onRemoveLast?.();
              }
            }}
            className="w-40 rounded-sm bg-transparent text-[15px] leading-[18px] font-semibold text-[#1f1f24] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#999]"
          />
        ) : (
          <span className="text-[15px] leading-[18px] font-semibold text-[#1f1f24]">
            {query}
            <span aria-hidden="true">|</span>
          </span>
        )}
      </div>
      {candidateLabels.length > 0 ? (
        <ul
          aria-label="タグ候補"
          className={`absolute top-full left-0 z-10 mt-1 w-[220px] rounded-[10px] bg-white px-2 ${
            suggestions.length === 0 && canCreate ? "py-1.5" : "py-2"
          }`}
        >
          {candidateLabels.map((label, index) => {
            const isCreateRow = index >= suggestions.length;
            return (
              <li
                key={label}
                className={`flex h-9 items-center rounded-md px-3 text-[14px] leading-[17px] text-[#1f1f24] ${
                  index === 0 ? "bg-[#f5f5f7]" : ""
                }`}
              >
                {onQueryChange ? (
                  <button
                    type="button"
                    disabled={disabled || (isCreateRow ? !onCreate : !onSelect)}
                    onClick={() => {
                      if (isCreateRow) onCreate?.();
                      else onSelect?.(suggestions[index]);
                    }}
                    className="flex h-full w-full items-center text-left focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50"
                  >
                    {label}
                  </button>
                ) : (
                  label
                )}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
});

export default TagComposer;
