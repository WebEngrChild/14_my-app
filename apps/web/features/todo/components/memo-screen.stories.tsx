import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";

import { sampleMemos } from "../data/sample-memos";
import MemoScreen from "./memo-screen";

const meta = {
  title: "Features/Todo/MemoScreen",
  component: MemoScreen,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story, context) => (
      <div
        className={
          context.parameters.fullHeight || context.parameters.desktopComparison
            ? "grid h-dvh"
            : "grid h-[400px]"
        }
      >
        <Story />
      </div>
    ),
  ],
  args: { memos: sampleMemos },
} satisfies Meta<typeof MemoScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Empty: Story = { args: { memos: [] } };
export const Desktop: Story = {
  parameters: { desktopComparison: true },
};
export const MobileList: Story = {
  globals: { viewport: { value: "iphone12", isRotated: false } },
  parameters: { fullHeight: true },
};
export const MobileEditor: Story = {
  globals: { viewport: { value: "iphone12", isRotated: false } },
  parameters: { fullHeight: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /買い物リストを更新する/ }));
    await expect(canvas.getByRole("button", { name: "一覧" })).toBeVisible();
    await expect(canvas.getByRole("textbox", { name: "メモのタイトル" })).toBeVisible();
  },
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
