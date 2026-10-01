import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import HeaderSearch from "./header-search";

const meta = {
  title: "Components/Layout/HeaderSearch",
  component: HeaderSearch,
  parameters: { layout: "centered" },
  args: { state: "Idle", query: "", status: "Success", memoResults: [], tagResults: [] },
  argTypes: {
    state: { control: "select", options: ["Idle", "Open"] },
    status: { control: "select", options: ["Loading", "Error", "Success"] },
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

export const Loading: Story = {
  args: {
    state: "Open",
    query: "会議",
    status: "Loading",
  },
};

export const SearchError: Story = {
  args: {
    state: "Open",
    query: "会議",
    status: "Error",
  },
};

// 実データ相当: 長いタイトル・本文の抜粋が折り返し/省略されるか確認する
export const MemoSearchLongText: Story = {
  args: {
    state: "Open",
    query: "デザイン",
    memoResults: [
      {
        id: 1,
        title:
          "Figmaでメモアプリのデザインを作成し、チームレビューに向けて画面遷移とコンポーネント設計を整理する",
        snippet:
          "ヘッダー検索・メモ一覧・編集ペインの3カラム構成で、スマホ時は1カラムに切り替える。デザイントークンは…",
      },
      { id: 2, title: "", snippet: "タイトル未入力のメモ。本文だけがデザインについて書かれている" },
    ],
  },
};

// 実データ相当: 候補が多いときのスクロール
export const MemoSearchManyResults: Story = {
  args: {
    state: "Open",
    query: "メモ",
    memoResults: Array.from({ length: 15 }, (_, index) => ({
      id: index + 1,
      title: `メモ ${index + 1}`,
      snippet: `${index + 1}件目のメモの本文の抜粋`,
    })),
  },
};

export const TagSearchManyResults: Story = {
  args: {
    state: "Open",
    query: "#",
    tagResults: [
      "仕事",
      "仕事関連",
      "買い物",
      "読書",
      "Next.js",
      "React",
      "デザイン",
      "旅行",
      "健康",
      "家計簿",
    ],
  },
};
