import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import MemoApp from "./memo-app";

// bun mock と NEXT_PUBLIC_API_BASE_URL=http://localhost:4010 が必要。
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
