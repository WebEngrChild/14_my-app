import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import MemoStatusMessage from "./memo-status-message";
import MemoWorkspace from "./memo-workspace";

const meta = {
  title: "Features/Todo/MemoStatusMessage",
  component: MemoStatusMessage,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="grid h-[400px]">
        <MemoWorkspace list={<Story />} />
      </div>
    ),
  ],
} satisfies Meta<typeof MemoStatusMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: { message: "読み込み中…" },
};

export const Empty: Story = {
  args: {
    message: "メモがありません",
    hint: "右下の「＋」から新しいメモを作成できます。",
  },
};

export const FetchError: Story = {
  args: {
    role: "alert",
    message: "メモの取得に失敗しました",
    hint: "通信環境を確認して、もう一度お試しください。",
    action: (
      <button
        type="button"
        className="mt-1 rounded px-2 py-1 text-[13px] text-[#111] underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
      >
        再読み込み
      </button>
    ),
  },
};
