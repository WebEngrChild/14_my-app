import type { ReactNode } from "react";

type MemoWorkspaceProps = {
  list?: ReactNode;
  editor?: ReactNode;
  action?: ReactNode;
};

export default function MemoWorkspace({ list, editor, action }: MemoWorkspaceProps) {
  return (
    <main
      aria-label="メモ"
      className="grid min-h-0 min-w-0 grid-cols-[360px_minmax(0,1fr)] overflow-hidden bg-white text-[#111]"
    >
      <aside
        aria-label="メモ一覧"
        className="min-h-0 min-w-0 overflow-y-auto border-r border-[#e5e7eb] bg-[#f7f7f8]"
      >
        {list}
      </aside>
      <section aria-label="メモ編集" className="relative min-h-0 min-w-0 overflow-hidden bg-white">
        <div className={`h-full overflow-y-auto ${action ? "pb-32" : ""}`}>{editor}</div>
        {action ? <div className="absolute right-[46px] bottom-[45px]">{action}</div> : null}
      </section>
    </main>
  );
}
