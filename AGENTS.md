# 実装ルール

- 実装する前に必ずdiff形式で実装内容を提示すること
- 提示して私が承認してから、実装をすること
- 実装時にはまとめて実装するのではなく、細かく変更範囲を小出しにすること
- 実装後は必ず以下を実行すること
  - `bun run lint:fix`（lintチェック＋自動修正）
  - `bun run format`（フォーマット）
  - `bun run test:unit`（ユニットテスト）
  - `bun run test:e2e`（E2Eテスト）
- `packages/db`配下のスキーマを変更した場合は、`bun run db:docs`を実行してDBドキュメント（`docs/db`）を更新すること
