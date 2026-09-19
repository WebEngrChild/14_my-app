type MemoSaveErrorNoticeProps = {
  count: number;
  onOpen: () => void;
};

// スマホの一覧表示中は編集ペインごと隠れて MemoSaveStatus が見えないため、
// 一覧側にも失敗を出し、再試行できる編集ペインへ誘導する。PCでは status 側に出るので隠す。
export default function MemoSaveErrorNotice({ count, onOpen }: MemoSaveErrorNoticeProps) {
  return (
    <div
      role="alert"
      className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-[#e5e7eb] bg-[#fdf2f2] px-5 py-3 md:hidden"
    >
      <p className="text-[13px] leading-[18px] text-[#b3261e]">{count}件の送信に失敗しました</p>
      <button
        type="button"
        onClick={onOpen}
        className="min-h-11 shrink-0 px-1 text-[13px] text-[#111] underline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-black"
      >
        開いて再試行
      </button>
    </div>
  );
}
