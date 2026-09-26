import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

async function loginAsTestUser(page: Page) {
  await page.goto("/login");
  await page.getByPlaceholder("メールアドレス").fill("test@test.com");
  await page.getByPlaceholder("パスワード").fill("123456789");
  await page.getByRole("button", { name: "ログイン", exact: true }).click();
  await expect(page).toHaveURL("http://localhost:3000/");
}

/** 「新しいメモを作成」を押し、POST /api/todos のレスポンスから採番されたIDを後始末登録用に返す。 */
async function createMemoAndTrack(
  page: Page,
  title: string,
  trackTodoForCleanup: (id: number) => void,
) {
  const createResponse = page.waitForResponse(
    (response) => response.request().method() === "POST" && response.url().endsWith("/api/todos"),
  );
  await page.getByRole("button", { name: "新しいメモを作成" }).click();
  await page.getByLabel("メモのタイトル").fill(title);
  const { id } = await (await createResponse).json();
  trackTodoForCleanup(id);
}

test("新規作成したメモのタイトルと本文が反映される", async ({ page, trackTodoForCleanup }) => {
  await loginAsTestUser(page);

  const title = `E2Eタイトル ${Date.now()}`;
  const body = `E2E本文 ${Date.now()}`;

  await createMemoAndTrack(page, title, trackTodoForCleanup);
  await page.getByLabel("メモの本文").fill(body);

  const firstItem = page.getByRole("complementary", { name: "メモ一覧" }).locator("li").first();
  await expect(firstItem).toContainText(title);
  await expect(firstItem).toContainText(body);

  // 自動保存(800msデバウンス)完了後、保存が成功したことも確認する
  await expect(page.getByRole("status", { name: "メモの保存状態" })).toHaveText("保存済み", {
    timeout: 10_000,
  });
});

test("新規作成したメモが一覧の先頭に降順で表示される", async ({ page, trackTodoForCleanup }) => {
  await loginAsTestUser(page);

  const title = `E2E降順確認 ${Date.now()}`;

  await createMemoAndTrack(page, title, trackTodoForCleanup);

  const firstItem = page.getByRole("complementary", { name: "メモ一覧" }).locator("li").first();
  await expect(firstItem).toContainText(title);
});
