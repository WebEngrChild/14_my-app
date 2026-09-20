import type { components } from "@/lib/api/generated";

// API接続までの画面確認用データ。
export const sampleMemos: components["schemas"]["Todo"][] = [
  {
    id: 1,
    title: "買い物リストを更新する",
    body: "牛乳とパンを買う。帰りにスーパーへ寄る。",
    createdAt: "2026-09-15T18:15:00+09:00",
    updatedAt: "2026-09-15T18:15:00+09:00",
  },
  {
    id: 2,
    title: "Next.jsのメモ",
    body: "認証まわりの実装方針を整理する。",
    createdAt: "2026-09-14T21:30:00+09:00",
    updatedAt: "2026-09-14T21:30:00+09:00",
  },
  {
    id: 3,
    title: "Figmaでメモアプリのデザインを作成",
    body: "メモアプリのレイアウトや余白、文字サイズなどを確認して全体のデザインを整えていく",
    createdAt: "2026-09-13T19:10:00+09:00",
    updatedAt: "2026-09-13T19:10:00+09:00",
  },
];
