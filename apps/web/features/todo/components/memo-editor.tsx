import { useEffect, useRef } from "react";

type MemoEditorProps = {
  focusTitle?: boolean;
  title: string;
  body: string;
  onTitleChange: (title: string) => void;
  onBodyChange: (body: string) => void;
};

export default function MemoEditor({
  title,
  body,
  onTitleChange,
  onBodyChange,
  focusTitle = false,
}: MemoEditorProps) {
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusTitle) titleRef.current?.focus();
  }, [focusTitle]);

  return (
    <div className="flex min-h-full flex-col gap-5 p-12">
      <input
        ref={titleRef}
        aria-label="メモのタイトル"
        type="text"
        value={title}
        onChange={(event) => onTitleChange(event.target.value)}
        placeholder="無題のメモ"
        className="w-full min-w-0 rounded-sm border-0 bg-transparent p-0 text-[28px] leading-9 font-semibold text-[#111] placeholder:text-[#999] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#999]"
      />
      <textarea
        aria-label="メモの本文"
        value={body}
        onChange={(event) => onBodyChange(event.target.value)}
        placeholder="メモを入力…"
        className="min-h-48 w-full flex-1 resize-none rounded-sm border-0 bg-transparent p-0 text-[16px] leading-[normal] text-[#333] placeholder:text-[#999] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#999]"
      />
    </div>
  );
}
