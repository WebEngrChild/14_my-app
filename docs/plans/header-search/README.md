# ヘッダー検索機能 実装計画

UI(検索バーの操作性)を先に構築し、バックエンドは後回しにする方針。フロント実装中は必要に応じて `scripts/mock-server.ts` のmockサーバーを活用する。

- [x] フェーズ1: 検索UIのインタラクション実装(データはダミー/ローカルstateでOK)
  - [x] `HeaderSearch` を操作するコンテナ(状態管理)を作成し、開閉制御(フォーカス/外側クリック/Escape)を実装
  - [x] キーボード操作(↑↓で候補移動、Enterで選択)を実装
  - [x] `#` 始まりでタグモードに切り替わる既存ロジックに合わせて、モード切り替え時の見た目・挙動を整理
  - [x] ローディング状態・エラー状態・空状態のUIパターンを追加(現状デザインにない)
  - [x] この段階では `memoResults`/`tagResults` は固定のダミーデータかStorybook用モックで動作確認する

- [ ] フェーズ2: mockサーバー側に検索エンドポイントを用意
  - [ ] `scripts/mock-server.ts` の `/api/todos` に `x-handler` を追加し、`q`(タイトル/本文部分一致)・`tag`(タグ名)クエリでのフィルタを実装(`/api/tags` の既存モックハンドラと同じ要領)
  - [ ] 併せて `/api/todos` のOpenAPI定義(またはmock専用の拡張)にクエリパラメータを追加し、型生成 or 手書き型でフロントから叩けるようにする
  - [ ] 実DBのスキーマ・usecase・repositoryにはまだ触らない

- [ ] フェーズ3: mockサーバーに繋ぎ込み
  - [ ] `features/todo/api/search-todos.ts`(仮)を新設し、mockサーバー相手に `/api/todos?q=...&tag=...` を呼ぶ
  - [ ] デバウンス処理・`AbortController` によるリクエストキャンセルを実装
  - [ ] フェーズ1で作ったコンテナのダミーデータ部分を実際のAPI呼び出しに差し替え、ローディング/エラー状態を本物の非同期処理に接続

- [ ] フェーズ4: Header⇔メモ一覧間の状態共有
  - [ ] `Header`(`layout.tsx`配下)と `MemoScreen`(`page.tsx`配下)が別ツリーである問題を解消(URLクエリパラメータ同期 or Context Providerのどちらかを選定)
  - [ ] メモ選択時に対象メモを開く・スクロール・検索欄を閉じる導線を実装
  - [ ] タグ選択時に一覧をそのタグで絞り込む導線を実装

- [ ] フェーズ5: mock環境でのテスト
  - [ ] Storybookに実データ相当のStory(候補あり/空/ローディング/エラー)を追加
  - [ ] mockサーバーを使ったE2Eテスト(メモ検索・タグ検索・選択後の遷移)を追加

- [ ] フェーズ6: 本番バックエンド実装への切り替え
  - [ ] `TodoRepository`(interface/Drizzle実装)に `q`/`tag` 検索を実装
  - [ ] `TodoUseCase.list()` / `TodoHandler.list(request)` / `app/api/todos/route.ts` をクエリパラメータ対応に変更
  - [ ] OpenAPIスキーマを正式に更新し、`generate-api-types.ts` で型を再生成(mock専用定義から本番定義への統合)
  - [ ] usecase/handlerの単体テスト、リポジトリの統合テストを追加

- [ ] フェーズ7: 最終確認
  - [ ] mock切り替えではなく実バックエンド相手にE2E含めて再検証
  - [ ] mock専用ハンドラと本番挙動に差異がないか確認
