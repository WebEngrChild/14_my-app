import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import MemoSaveErrorNotice from "./memo-save-error-notice";

const meta = {
  title: "Features/Todo/MemoSaveErrorNotice",
  component: MemoSaveErrorNotice,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="w-[390px] bg-[#f7f7f8]">
        <Story />
      </div>
    ),
  ],
  args: { count: 1, onOpen: fn() },
} satisfies Meta<typeof MemoSaveErrorNotice>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleFailure: Story = {};
export const MultipleFailures: Story = { args: { count: 3 } };
export const OpenFailedMemo: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "開いて再試行" }));
    await expect(args.onOpen).toHaveBeenCalledOnce();
  },
};
