import { forwardRef } from "react";

type MemoResult = {
  id: number;
  title: string;
  snippet: string;
};

type HeaderSearchProps = {
  state?: "Idle" | "Open";
  query?: string;
  memoResults?: MemoResult[];
  tagResults?: string[];
  onQueryChange?: (query: string) => void;
  onSelectMemo?: (id: number) => void;
  onSelectTag?: (tag: string) => void;
};

const HeaderSearch = forwardRef<HTMLInputElement, HeaderSearchProps>(function HeaderSearch(
  {
    state = "Idle",
    query = "",
    memoResults = [],
    tagResults = [],
    onQueryChange,
    onSelectMemo,
    onSelectTag,
  },
  ref,
) {
  // "#" から始まる場合はタグ検索、それ以外はメモ本文検索として扱う。
  const isTagMode = query.startsWith("#");
  const isOpen = state === "Open";

  return (
    <div className="relative w-full max-w-xs">
      <input
        ref={ref}
        type="text"
        value={query}
        onChange={(event) => onQueryChange?.(event.target.value)}
        placeholder="メモを検索（#でタグ検索）"
        aria-label="メモ・タグを検索"
        className="h-9 w-full rounded-full border border-[#e5e5ea] bg-[#f5f5f7] px-4 text-[14px] leading-[17px] text-[#1f1f24] placeholder:text-[#999] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5f52e9]"
      />

      {isOpen ? (
        <div className="absolute top-full left-0 z-10 mt-2 w-full overflow-hidden rounded-[10px] bg-white py-2 shadow-lg">
          {isTagMode ? (
            tagResults.length > 0 ? (
              <ul aria-label="タグ候補">
                {tagResults.map((tag) => (
                  <li key={tag}>
                    <button
                      type="button"
                      onClick={() => onSelectTag?.(tag)}
                      className="flex h-9 w-full items-center px-4 text-left text-[14px] text-[#1f1f24] hover:bg-[#f5f5f7]"
                    >
                      #{tag}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 py-2 text-[13px] text-[#999]">該当するタグがありません</p>
            )
          ) : memoResults.length > 0 ? (
            <ul aria-label="メモ候補">
              {memoResults.map((memo) => (
                <li key={memo.id}>
                  <button
                    type="button"
                    onClick={() => onSelectMemo?.(memo.id)}
                    className="flex w-full flex-col items-start px-4 py-2 text-left hover:bg-[#f5f5f7]"
                  >
                    <span className="w-full truncate text-[14px] font-semibold text-[#1f1f24]">
                      {memo.title || "無題のメモ"}
                    </span>
                    <span className="line-clamp-1 w-full text-[12px] text-[#666]">
                      {memo.snippet}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-2 text-[13px] text-[#999]">該当するメモがありません</p>
          )}
        </div>
      ) : null}
    </div>
  );
});

export default HeaderSearch;
