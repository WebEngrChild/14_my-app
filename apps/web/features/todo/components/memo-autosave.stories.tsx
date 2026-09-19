import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useMemo } from "react";

import type { MemoSaver } from "../autosave/types";
import { sampleMemos } from "../data/sample-memos";
import MemoScreen from "./memo-screen";

// ネットワークなしで、初回失敗 → 再試行成功と通信中の表示を確認する。
function RetryDemo() {
  const saveMemo = useMemo<MemoSaver>(() => {
    let attempts = 0;
    return async ({ signal }) => {
      await new Promise<void>((resolve) => setTimeout(resolve, 1200));
      signal.throwIfAborted();
      attempts += 1;
      if (attempts === 1) throw new Error("確認用の通信失敗");
    };
  }, []);

  return <MemoScreen memos={sampleMemos} saveMemo={saveMemo} />;
}

const meta = {
  title: "Features/Todo/MemoAutosave",
  component: RetryDemo,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="grid h-dvh">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RetryDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RetryAfterFailure: Story = {};
