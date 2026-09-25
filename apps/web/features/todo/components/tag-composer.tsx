type TagComposerProps = {
  state?: "Idle" | "Matching" | "NoMatch";
  query?: string;
  suggestions?: string[];
};

export default function TagComposer({
  state = "Idle",
  query = "",
  suggestions = [],
}: TagComposerProps) {
  if (state === "Idle") {
    return <div className="h-[37px] w-6" />;
  }

  const candidateLabels =
    state === "NoMatch"
      ? [`+ #${query} を追加する`]
      : suggestions.map((suggestion) => `#${suggestion}`);

  return (
    <div className="relative flex h-[37px] w-max min-w-16 items-center justify-center px-[5px]">
      <div className="w-max min-w-[54px] border-b border-[#29292e] pb-1 whitespace-nowrap">
        <span className="text-[15px] leading-[18px] font-semibold text-[#1f1f24]">
          {query}
          <span aria-hidden="true">|</span>
        </span>
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
              {label}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
