import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import HeaderSearch from "./header-search";

const meta = {
  title: "Components/Layout/HeaderSearch",
  component: HeaderSearch,
  parameters: { layout: "centered" },
  args: { state: "Idle", query: "", memoResults: [], tagResults: [] },
  argTypes: {
    state: { control: "select", options: ["Idle", "Open"] },
  },
  decorators: [
    (Story) => (
      <div className="min-h-[260px] w-[320px] bg-white p-6">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof HeaderSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {};

export const MemoSearchWithResults: Story = {
  args: {
    state: "Open",
    query: "会議",
    memoResults: [
      { id: 1, title: "定例会議メモ", snippet: "来週の定例会議のアジェンダをまとめる" },
      { id: 2, title: "1on1メモ", snippet: "会議室の予約が取れたので木曜に実施" },
    ],
  },
};

export const MemoSearchNoResults: Story = {
  args: {
    state: "Open",
    query: "存在しないキーワード",
  },
};

export const TagSearchWithResults: Story = {
  // "#" から始まるとタグ検索モードになる
  args: {
    state: "Open",
    query: "#仕事",
    tagResults: ["仕事", "仕事関連"],
  },
};

export const TagSearchNoResults: Story = {
  args: {
    state: "Open",
    query: "#存在しないタグ",
  },
};
