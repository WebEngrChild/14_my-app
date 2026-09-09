import { expect, test } from "@playwright/test";

test("ログインに成功する", async ({ page }) => {
  await page.goto("/login");

  await page.getByPlaceholder("メールアドレス").fill("test@test.com");
  await page.getByPlaceholder("パスワード").fill("123456789");
  await page.getByRole("button", { name: "ログイン", exact: true }).click();

  await expect(page).toHaveURL("http://localhost:3000/");
});
