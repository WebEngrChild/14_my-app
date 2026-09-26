import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import MemoApp from "./memo-app";

// 接続済みStoryはローカルDBとアプリの実APIを使用する。
const meta = {
  title: "Features/Todo/MemoApp",
  component: MemoApp,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="grid h-dvh">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MemoApp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Connected: Story = {};
