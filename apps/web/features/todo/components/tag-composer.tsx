type TagComposerProps = {
  state?: "Idle" | "Matching" | "NoMatch";
  query?: string;
  suggestions?: string[];
  disabled?: boolean;
  onQueryChange?: (query: string) => void;
  onSelect?: (name: string) => void;
  onCreate?: () => void;
};

export default function TagComposer({
  state = "Idle",
  query = "",
  suggestions = [],
  disabled = false,
  onQueryChange,
  onSelect,
  onCreate,
}: TagComposerProps) {
  if (state === "Idle" && !onQueryChange) {
    return <div className="h-[37px] w-6" />;
  }

  const candidateLabels =
    state === "Idle"
      ? []
      : state === "NoMatch"
        ? query.trim()
          ? [`+ #${query.trim()} を追加する`]
          : []
        : suggestions.map((suggestion) => `#${suggestion}`);

  return (
    <div className="relative flex h-[37px] w-max min-w-16 items-center justify-center px-[5px]">
      <div className="w-max min-w-[54px] border-b border-[#29292e] pb-1 whitespace-nowrap">
        {onQueryChange ? (
          <input
            aria-label="タグを入力"
            type="text"
            value={query}
            disabled={disabled}
            placeholder="タグを追加"
            onChange={(event) => onQueryChange(event.target.value)}
            className="w-40 bg-transparent text-[15px] leading-[18px] font-semibold text-[#1f1f24] focus-visible:outline-2 focus-visible:outline-offset-4"
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
            state === "NoMatch" ? "py-1.5" : "py-2"
          }`}
        >
          {candidateLabels.map((label, index) => (
            <li
              key={label}
              className={`flex h-9 items-center rounded-md px-3 text-[14px] leading-[17px] text-[#1f1f24] ${
                index === 0 ? "bg-[#f5f5f7]" : ""
              }`}
            >
              {onQueryChange ? (
                <button
                  type="button"
                  disabled={disabled || (state === "NoMatch" ? !onCreate : !onSelect)}
                  onClick={() => {
                    if (state === "NoMatch") onCreate?.();
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
          ))}
        </ul>
      ) : null}
    </div>
  );
}
