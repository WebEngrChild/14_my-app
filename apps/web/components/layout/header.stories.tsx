import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Header from "./header";

const meta = {
  title: "Components/Layout/Header",
  component: Header,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LoginPage: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/login",
      },
    },
  },
};
