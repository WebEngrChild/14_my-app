import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

async function loginAsTestUser(page: Page) {
  await page.goto("/login");
  await page.getByPlaceholder("メールアドレス").fill("test@test.com");
  await page.getByPlaceholder("パスワード").fill("123456789");
  await page.getByRole("button", { name: "ログイン", exact: true }).click();
  await expect(page).toHaveURL("http://localhost:3000/");
}

test("新規作成したメモのタイトルと本文が反映される", async ({ page }) => {
  await loginAsTestUser(page);

  const title = `E2Eタイトル ${Date.now()}`;
  const body = `E2E本文 ${Date.now()}`;

  await page.getByRole("button", { name: "新しいメモを作成" }).click();
  await page.getByLabel("メモのタイトル").fill(title);
  await page.getByLabel("メモの本文").fill(body);

  const firstItem = page.getByRole("complementary", { name: "メモ一覧" }).locator("li").first();
  await expect(firstItem).toContainText(title);
  await expect(firstItem).toContainText(body);

  // 自動保存(800msデバウンス)完了後、保存が成功したことも確認する
  await expect(page.getByRole("status")).toHaveText("保存済み", { timeout: 10_000 });
});

test("新規作成したメモが一覧の先頭に降順で表示される", async ({ page }) => {
  await loginAsTestUser(page);

  const title = `E2E降順確認 ${Date.now()}`;

  await page.getByRole("button", { name: "新しいメモを作成" }).click();
  await page.getByLabel("メモのタイトル").fill(title);

  const firstItem = page.getByRole("complementary", { name: "メモ一覧" }).locator("li").first();
  await expect(firstItem).toContainText(title);
});
