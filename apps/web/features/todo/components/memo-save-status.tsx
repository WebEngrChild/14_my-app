import type { SaveStatus } from "../autosave/types";

type MemoSaveStatusProps = {
  status: SaveStatus;
  onRetry: () => void;
  hasErrors?: boolean;
};

const labels: Record<SaveStatus, string> = {
  idle: "",
  pending: "送信待ち…",
  saving: "送信中…",
  success: "保存済み",
  error: "送信に失敗しました",
};

export default function MemoSaveStatus({
  status,
  onRetry,
  hasErrors = false,
}: MemoSaveStatusProps) {
  return (
    <div className="space-y-1 text-xs text-[#666]">
      <p>変更は自動保存されます</p>
      <div className="flex items-center gap-3">
        <p role="status" aria-live="polite">
          {labels[status]}
        </p>
        {status === "error" ? (
          <button
            type="button"
            onClick={onRetry}
            className="rounded px-2 py-1 text-[#111] underline focus-visible:outline-2"
          >
            再試行
          </button>
        ) : null}
      </div>
      {hasErrors && status !== "error" ? (
        <p>別のメモで送信に失敗しています。選択して再試行してください。</p>
      ) : null}
    </div>
  );
}
