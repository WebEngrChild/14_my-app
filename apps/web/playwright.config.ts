import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  // `.spec` だと Bun のテスト検出にも引っかかるため、e2e は `.e2e.ts` で住み分ける。
  testMatch: /.*\.e2e\.ts/,
  fullyParallel: true,
  use: {
    baseURL: "http://localhost:3000",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "bun run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
  },
});
