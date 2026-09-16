import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import MemoListItem from "./memo-list-item";

const meta = {
  title: "Features/Todo/MemoListItem",
  component: MemoListItem,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="w-[360px]">
        <Story />
      </div>
    ),
  ],
  args: {
    memo: {
      id: 1,
      title: "買い物リストを更新する",
      body: "牛乳とパンを買う。帰りにスーパーへ寄る。",
      createdAt: "2026-09-15T18:15:00+09:00",
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MemoListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { selected: true } };
export const LongContent: Story = {
  args: {
    memo: {
      ...meta.args.memo,
      title: "Figmaでメモアプリのデザインを作成して全体のレイアウトを確認する",
      body: "メモアプリのレイアウトや余白、文字サイズなどを確認して全体のデザインを整えていく。長い本文は2行まで表示する。",
    },
  },
};
export const EmptyContent: Story = {
  args: { memo: { ...meta.args.memo, title: "", body: "" } },
};
