import type { components } from "@/lib/api/generated";

type MemoListItemProps = {
  memo: components["schemas"]["Todo"];
  selected?: boolean;
  onSelect?: () => void;
};

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export default function MemoListItem({ memo, selected = false, onSelect }: MemoListItemProps) {
  return (
    <button
      type="button"
      aria-current={selected ? "true" : undefined}
      onClick={onSelect}
      className={`flex h-28 w-full min-w-0 flex-col overflow-hidden px-5 py-4 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-black md:h-32 md:pt-[18px] md:pb-[19px] ${
        selected ? "bg-[#eceef1]" : "bg-[#f7f7f8] hover:bg-[#eceef1]"
      }`}
    >
      <span className="block w-full truncate text-[16px] leading-[19px] font-semibold text-black">
        {memo.title || "無題のメモ"}
      </span>
      <span className="mt-2 line-clamp-1 h-[18px] w-full shrink-0 text-[13px] leading-[18px] wrap-anywhere text-[#666] md:mt-[13px] md:line-clamp-2 md:h-9">
        {memo.body}
      </span>
      <time dateTime={memo.createdAt} className="mt-2 block text-[11px] leading-[15px] text-[#999]">
        {dateFormatter.format(new Date(memo.createdAt))}
      </time>
    </button>
  );
}
