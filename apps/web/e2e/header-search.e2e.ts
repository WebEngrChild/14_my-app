import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

const MOCK_ORIGIN = "http://localhost:4010";

// 本番APIは q/tag 未対応(フェーズ6で実装)のため、検索系のGETだけmockサーバーへ転送する。
async function useMockSearchApi(page: Page) {
  await page.route(/\/api\/(todos|tags)(\/|\?|$)/, async (route) => {
    const request = route.request();
    if (request.method() !== "GET") return route.continue();
    const url = new URL(request.url());
    const response = await route.fetch({ url: `${MOCK_ORIGIN}${url.pathname}${url.search}` });
    await route.fulfill({ response });
  });
}

async function loginAsTestUser(page: Page) {
  await page.goto("/login");
  await page.getByPlaceholder("メールアドレス").fill("test@test.com");
  await page.getByPlaceholder("パスワード").fill("123456789");
  await page.getByRole("button", { name: "ログイン", exact: true }).click();
  await expect(page).toHaveURL("http://localhost:3000/");
}

function memoList(page: Page) {
  return page.getByRole("complementary", { name: "メモ一覧" }).getByRole("listitem");
}

test.beforeEach(async ({ page }) => {
  await useMockSearchApi(page);
  await loginAsTestUser(page);
  await expect(memoList(page)).toHaveCount(3);
});

test("メモ検索で候補を選ぶと、そのメモが開き検索欄が閉じる", async ({ page }) => {
  const input = page.getByPlaceholder("メモを検索（#でタグ検索）");
  await input.fill("認証");

  const option = page.getByRole("option", { name: /Next\.jsのメモ/ });
  await expect(option).toBeVisible();
  await expect(page.getByRole("option")).toHaveCount(1);
  await option.click();

  await expect(page.getByLabel("メモのタイトル")).toHaveValue("Next.jsのメモ");
  await expect(page.getByRole("option")).toHaveCount(0);
});

test("該当なしのときは空状態を表示する", async ({ page }) => {
  await page.getByPlaceholder("メモを検索（#でタグ検索）").fill("存在しないキーワード");
  await expect(page.getByText("該当するメモがありません")).toBeVisible();
});

test("タグを選ぶと一覧がそのタグで絞り込まれ、解除で元に戻る", async ({ page }) => {
  await page.getByPlaceholder("メモを検索（#でタグ検索）").fill("#仕");
  await expect(page.getByRole("option")).toHaveCount(2);
  await page.getByRole("option", { name: "#仕事", exact: true }).click();

  const clearButton = page.getByRole("button", { name: "#仕事 の絞り込みを解除" });
  await expect(clearButton).toBeVisible();
  await expect(memoList(page)).toHaveCount(1);
  await expect(memoList(page)).toContainText("買い物リストを更新する");

  await clearButton.click();
  await expect(memoList(page)).toHaveCount(3);
});
