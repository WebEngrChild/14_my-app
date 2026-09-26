import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import TagComposer from "./tag-composer";

const meta = {
  title: "Features/Todo/TagComposer",
  component: TagComposer,
  parameters: { layout: "centered" },
  args: { state: "Idle", query: "", suggestions: [], canCreate: false },
  argTypes: {
    state: { control: "select", options: ["Idle", "Open"] },
  },
  decorators: [
    (Story) => (
      <div className="min-h-[180px] w-[268px] bg-white p-6">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof TagComposer>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Idle: Story = {};
export const Matching: Story = {
  args: {
    state: "Open",
    query: "仕事",
    suggestions: ["仕事", "仕事関連"],
  },
};
export const NoMatch: Story = {
  args: { state: "Open", query: "仕事", canCreate: true },
};
// 既存タグに部分一致しつつ、完全一致するタグはまだ無いケース。候補と新規作成を両方出す。
export const MatchingWithCreate: Story = {
  args: {
    state: "Open",
    query: "he",
    suggestions: ["hello", "hello world"],
    canCreate: true,
  },
};
