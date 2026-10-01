import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import MemoTagFilterChip from "./memo-tag-filter-chip";

const meta = {
  title: "Features/Todo/MemoTagFilterChip",
  component: MemoTagFilterChip,
  args: { tag: "仕事", onClear: fn() },
  tags: ["autodocs"],
} satisfies Meta<typeof MemoTagFilterChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongTag: Story = {
  args: { tag: "とても長いタグ名のときの表示確認用タグ" },
};

export const Clear: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "#仕事 の絞り込みを解除" }));
    await expect(args.onClear).toHaveBeenCalledTimes(1);
  },
};
