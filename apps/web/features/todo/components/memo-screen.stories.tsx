import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { sampleMemos } from "../data/sample-memos";
import MemoScreen from "./memo-screen";

const meta = {
  title: "Features/Todo/MemoScreen",
  component: MemoScreen,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story, context) => (
      <div className={context.parameters.desktopComparison ? "grid h-dvh" : "grid h-[400px]"}>
        <Story />
      </div>
    ),
  ],
  args: { memos: sampleMemos },
} satisfies Meta<typeof MemoScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Desktop: Story = {
  parameters: { desktopComparison: true },
};
export const Scrollable: Story = {
  args: {
    memos: Array.from({ length: 12 }, (_, index) => ({
      ...sampleMemos[index % sampleMemos.length],
      id: index + 1,
      title: `メモ ${index + 1}`,
    })),
  },
};
