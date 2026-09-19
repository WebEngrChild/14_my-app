import type { ReactNode } from "react";

type MemoWorkspaceProps = {
  list?: ReactNode;
  editor?: ReactNode;
  action?: ReactNode;
  status?: ReactNode;
  // スマホは1カラムなので、どちらのペインを見せるかを呼び出し側が決める。
  mobileView?: "list" | "editor";
  onBack?: () => void;
};

export default function MemoWorkspace({
  list,
  editor,
  action,
  status,
  mobileView = "list",
  onBack,
}: MemoWorkspaceProps) {
  return (
    <main
      aria-label="メモ"
      className="relative grid min-h-0 min-w-0 grid-cols-1 overflow-hidden bg-white text-[#111] md:grid-cols-[360px_minmax(0,1fr)]"
    >
      <aside
        aria-label="メモ一覧"
        className={`min-h-0 min-w-0 overflow-y-auto border-[#e5e7eb] bg-[#f7f7f8] md:block md:border-r ${
          mobileView === "editor" ? "hidden" : "block"
        }`}
      >
        {list}
      </aside>
      <section
        aria-label="メモ編集"
        className={`relative min-h-0 min-w-0 flex-col overflow-hidden bg-white md:flex ${
          mobileView === "list" ? "hidden" : "flex"
        }`}
      >
        {onBack ? (
          <div className="shrink-0 border-b border-[#e5e7eb] md:hidden">
            <button
              type="button"
              onClick={onBack}
              className="flex min-h-11 items-center gap-1 px-5 py-3 text-[14px] text-[#111] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-black"
            >
              <span aria-hidden="true">‹</span>
              一覧
            </button>
          </div>
        ) : null}
        <div className={`min-h-0 flex-1 overflow-y-auto ${action ? "pb-28 md:pb-32" : ""}`}>
          {editor}
        </div>
        {status ? (
          <div className="absolute right-5 bottom-5 left-5 bg-white/95 md:right-32 md:bottom-12 md:left-12">
            {status}
          </div>
        ) : null}
      </section>
      {action ? (
        // PCでは main の右下が編集ペインの右下と一致し、スマホでは表示中のペインに重なる。
        <div className="absolute right-5 bottom-5 md:right-[46px] md:bottom-[45px]">{action}</div>
      ) : null}
    </main>
  );
}
