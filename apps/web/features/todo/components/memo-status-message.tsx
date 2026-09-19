import type { ReactNode } from "react";

type MemoStatusMessageProps = {
  // 取得失敗は alert、読み込み中・空は status で読み上げる。
  role?: "status" | "alert";
  message: string;
  hint?: string;
  action?: ReactNode;
};

export default function MemoStatusMessage({
  role = "status",
  message,
  hint,
  action,
}: MemoStatusMessageProps) {
  return (
    <div
      role={role}
      aria-live="polite"
      className="flex h-full min-h-32 flex-col items-center justify-center gap-2 px-5 py-12 text-center"
    >
      <p className="text-[13px] leading-[18px] text-[#666]">{message}</p>
      {hint ? <p className="text-[11px] leading-[15px] text-[#999]">{hint}</p> : null}
      {action}
    </div>
  );
}
