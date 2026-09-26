import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

async function loginAsTestUser(page: Page) {
  await page.goto("/login");
  await page.getByPlaceholder("メールアドレス").fill("test@test.com");
  await page.getByPlaceholder("パスワード").fill("123456789");
  await page.getByRole("button", { name: "ログイン", exact: true }).click();
  await expect(page).toHaveURL("http://localhost:3000/");
}

async function createSavedMemo(page: Page, title: string) {
  await page.getByRole("button", { name: "新しいメモを作成" }).click();
  await page.getByLabel("メモのタイトル").fill(title);
  // 保存完了(=実IDが払い出された状態)を待ってからタグ操作を行う
  await expect(page.getByRole("status", { name: "メモの保存状態" })).toHaveText("保存済み", {
    timeout: 10_000,
  });
}

function memoListItem(page: Page, title: string) {
  return page
    .getByRole("complementary", { name: "メモ一覧" })
    .locator("li")
    .filter({ hasText: title });
}

async function createTagOnCurrentMemo(page: Page, tagName: string) {
  await page.getByLabel("タグを入力").fill(tagName);
  const createButton = page.getByRole("button", { name: `+ #${tagName} を追加する` });
  await expect(createButton).toBeVisible();
  await createButton.click();
  await expect(page.getByText(`#${tagName}`)).toBeVisible();
}

test("タグの取得・付与・解除がページ再読み込み後も保持される", async ({ page }) => {
  await loginAsTestUser(page);

  const suffix = Date.now();
  const titleA = `E2Eタグ付与A ${suffix}`;
  const titleB = `E2Eタグ付与B ${suffix}`;
  const tagName = `E2Eタグ${suffix}`;

  await test.step("メモAを作成し、新規タグを作成して付与する", async () => {
    await createSavedMemo(page, titleA);
    await createTagOnCurrentMemo(page, tagName);
  });

  await test.step("メモBを作成し、既存タグ候補から付与する", async () => {
    await createSavedMemo(page, titleB);

    // 部分一致で検索し、GET /api/tags で取得した既存タグ候補が表示されることを確認する
    await page.getByLabel("タグを入力").fill(tagName.slice(0, -2));
    const suggestion = page.getByRole("button", { name: `#${tagName}`, exact: true });
    await expect(suggestion).toBeVisible();
    await suggestion.click();
    await expect(page.getByText(`#${tagName}`)).toBeVisible();
    // 直前の付与処理(isSaving)が完全に終わってから次の操作に進む
    await expect(page.getByRole("status").filter({ hasText: "タグを更新中" })).toHaveCount(0);
  });

  await test.step("メモBからタグを外す", async () => {
    const detachButton = page.getByRole("button", {
      name: `このメモからタグ「${tagName}」を外す`,
    });
    const chip = page.getByText(`#${tagName}`);
    // 稀に1回目のクリックが取りこぼされることがあるため、消えなければもう一度試す
    await detachButton.click();
    try {
      await expect(chip).toHaveCount(0, { timeout: 5_000 });
    } catch {
      await detachButton.click();
      await expect(chip).toHaveCount(0, { timeout: 5_000 });
    }
  });

  await test.step("ページ再読み込み後もメモAのタグが保持されている", async () => {
    await page.reload();
    await memoListItem(page, titleA).click();
    await expect(page.getByText(`#${tagName}`)).toBeVisible();
  });
});

test("タグ付与に失敗した場合、エラー表示から再試行すると成功しDBにも反映される", async ({
  page,
}) => {
  await loginAsTestUser(page);

  let shouldFail = true;
  await page.route("**/api/todos/*/tags/*", async (route) => {
    if (route.request().method() !== "PUT") {
      await route.continue();
      return;
    }
    if (shouldFail) {
      await route.fulfill({ status: 500 });
      return;
    }
    await route.continue();
  });

  const suffix = Date.now();
  const title = `E2E付与失敗 ${suffix}`;
  const tagName = `E2E付与失敗タグ${suffix}`;

  // 保存完了を待たずにタグを追加し、新規メモ作成の「保存後に付与」経路を通す
  await page.getByRole("button", { name: "新しいメモを作成" }).click();
  await page.getByLabel("メモのタイトル").fill(title);
  await page.getByLabel("タグを入力").fill(tagName);
  await page.getByRole("button", { name: `+ #${tagName} を追加する` }).click();

  // 楽観的にタグ自体はすぐ表示される
  await expect(page.getByText(`#${tagName}`)).toBeVisible();

  const attachAlert = page.getByRole("alert").filter({ hasText: "タグの付与に失敗しました" });
  await expect(attachAlert).toBeVisible({ timeout: 10_000 });

  shouldFail = false;
  await attachAlert.getByRole("button", { name: "再試行" }).click();

  // 再試行後にエラー表示が消え、かつ実際にDBへ反映されていることをリロードして確認する
  await expect(attachAlert).toHaveCount(0);
  await page.waitForTimeout(1_000);
  await expect(page.getByRole("alert").filter({ hasText: "タグの付与に失敗しました" })).toHaveCount(
    0,
  );

  await page.reload();
  await memoListItem(page, title).click();
  await expect(page.getByText(`#${tagName}`)).toBeVisible({ timeout: 10_000 });
});

test("タグ取得に失敗した場合、再読み込みで復旧する", async ({ page }) => {
  await loginAsTestUser(page);

  const suffix = Date.now();
  const title = `E2E取得失敗 ${suffix}`;
  const tagName = `E2E取得失敗タグ${suffix}`;

  await createSavedMemo(page, title);
  const [attachResponse] = await Promise.all([
    page.waitForResponse(
      (response) =>
        response.request().method() === "PUT" &&
        /\/api\/todos\/\d+\/tags\/\d+$/.test(response.url()),
    ),
    createTagOnCurrentMemo(page, tagName),
  ]);
  // 他テストが並行して作成する別メモへのGETを誤って横取りしないよう、対象メモのIDに絞り込む
  const todoId = attachResponse.url().match(/\/api\/todos\/(\d+)\/tags\//)?.[1];

  // dev環境はeffectが二重発火しうるため、呼び出し回数ではなくフラグで失敗/成功を明示的に切り替える
  let shouldFail = true;
  await page.route(`**/api/todos/${todoId}/tags`, async (route) => {
    if (route.request().method() !== "GET") {
      await route.continue();
      return;
    }
    if (shouldFail) {
      await route.fulfill({ status: 500 });
      return;
    }
    await route.continue();
  });

  await page.reload();
  await memoListItem(page, title).click();

  const loadErrorAlert = page
    .getByRole("alert")
    .filter({ hasText: "メモのタグ取得に失敗しました" });
  await expect(loadErrorAlert).toBeVisible();
  await expect(page.getByText(`#${tagName}`)).toHaveCount(0);

  shouldFail = false;
  await loadErrorAlert.getByRole("button", { name: "再読み込み" }).click();

  // 再読み込みで実際にGETが成功し、DB上のタグが表示されることを確認する
  await expect(loadErrorAlert).toHaveCount(0);
  await expect(page.getByText(`#${tagName}`)).toBeVisible();
});
