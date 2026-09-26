import { test as base, expect } from "@playwright/test";

type Fixtures = {
  /** テスト中に作成したメモのIDを登録すると、テスト終了時にDELETEで後始末する。 */
  trackTodoForCleanup: (id: number) => void;
};

export const test = base.extend<Fixtures>({
  trackTodoForCleanup: async ({ page }, use) => {
    const ids: number[] = [];
    await use((id) => {
      ids.push(id);
    });
    // page.request はログイン済みブラウザコンテキストとCookieを共有するため、認証付きで削除できる。
    await Promise.all(
      ids.map((id) =>
        page.request.delete(`/api/todos/${id}`).catch(() => {
          // 後始末の失敗でテスト結果を左右しない
        }),
      ),
    );
  },
});

export { expect };
