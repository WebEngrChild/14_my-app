import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

// header-search.e2e.ts(mock版)と同じ導線を、実バックエンド(DB)相手に確認する。
// 既存データと混ざらないよう、一意な目印付きのメモ・タグをAPIで作成し、終了時に削除する。

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

async function createTodo(
  page: Page,
  input: { title: string; body: string },
  trackTodoForCleanup: (id: number) => void,
) {
  const response = await page.request.post("/api/todos", { data: input });
  expect(response.status()).toBe(201);
  const { id } = await response.json();
  trackTodoForCleanup(id);
  return id as number;
}

const createdTagIds: number[] = [];

async function createTagOn(page: Page, todoId: number, name: string) {
  const response = await page.request.post("/api/tags", { data: { name } });
  expect(response.status()).toBe(201);
  const { id } = await response.json();
  createdTagIds.push(id);
  expect((await page.request.put(`/api/todos/${todoId}/tags/${id}`)).status()).toBe(204);
}

test.afterEach(async ({ page }) => {
  await Promise.all(
    createdTagIds.splice(0).map((id) =>
      page.request.delete(`/api/tags/${id}`).catch(() => {
        // 後始末の失敗でテスト結果を左右しない
      }),
    ),
  );
});

test.beforeEach(async ({ page }) => {
  await loginAsTestUser(page);
});

test("本文に一致するメモを検索して選ぶと、そのメモが開き検索欄が閉じる", async ({
  page,
  trackTodoForCleanup,
}) => {
  const mark = Date.now();
  const title = `E2E検索 ${mark}`;
  await createTodo(page, { title, body: `認証の方針 ${mark}` }, trackTodoForCleanup);
  await createTodo(page, { title: `E2E検索ダミー ${mark}`, body: "" }, trackTodoForCleanup);
  await page.reload();

  await page.getByPlaceholder("メモを検索（#でタグ検索）").fill(`認証の方針 ${mark}`);
  const option = page.getByRole("option", { name: new RegExp(title) });
  await expect(option).toBeVisible();
  await expect(page.getByRole("option")).toHaveCount(1);
  await option.click();

  await expect(page.getByLabel("メモのタイトル")).toHaveValue(title);
  await expect(page.getByRole("option")).toHaveCount(0);
});

test("該当なしのときは空状態を表示する", async ({ page }) => {
  await page.getByPlaceholder("メモを検索（#でタグ検索）").fill(`存在しない ${Date.now()}`);
  await expect(page.getByText("該当するメモがありません")).toBeVisible();
});

test("タグを選ぶと一覧がそのタグのメモだけになり、解除で元に戻る", async ({
  page,
  trackTodoForCleanup,
}) => {
  const mark = Date.now();
  const tagged = `E2Eタグ絞り込みA ${mark}`;
  const untagged = `E2Eタグ絞り込みB ${mark}`;
  const tagName = `E2E絞り込み${mark}`;
  const taggedId = await createTodo(page, { title: tagged, body: "" }, trackTodoForCleanup);
  await createTodo(page, { title: untagged, body: "" }, trackTodoForCleanup);
  await createTagOn(page, taggedId, tagName);
  await page.reload();
  await expect(memoList(page).filter({ hasText: untagged })).toHaveCount(1);
  const total = await memoList(page).count();

  await page.getByPlaceholder("メモを検索（#でタグ検索）").fill(`#${tagName.slice(0, -2)}`);
  await page.getByRole("option", { name: `#${tagName}`, exact: true }).click();

  const clearButton = page.getByRole("button", { name: `#${tagName} の絞り込みを解除` });
  await expect(clearButton).toBeVisible();
  await expect(memoList(page)).toHaveCount(1);
  await expect(memoList(page)).toContainText(tagged);

  await clearButton.click();
  await expect(memoList(page)).toHaveCount(total);
});
