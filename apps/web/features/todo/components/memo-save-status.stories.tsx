import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import MemoSaveStatus from "./memo-save-status";

const meta = {
  title: "Features/Todo/MemoSaveStatus",
  component: MemoSaveStatus,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="bg-white p-6">
        <Story />
      </div>
    ),
  ],
  args: { status: "idle", onRetry: () => {} },
} satisfies Meta<typeof MemoSaveStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {};
export const Pending: Story = { args: { status: "pending" } };
export const Saving: Story = { args: { status: "saving" } };
export const Success: Story = { args: { status: "success" } };
export const Failed: Story = { args: { status: "error" } };
export const OtherMemoError: Story = { args: { status: "success", hasErrors: true } };
