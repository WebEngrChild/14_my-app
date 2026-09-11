# Webアプリケーション開発

## 1. ZodでAPIスキーマを定義する

APIのリクエストやレスポンスは、Zod Schemaを正本として定義します。

```text
server/handler/schemas/
└── todo.ts
```

Route Handlerでも同じSchemaを使用して、実際のレスポンスを検証します。

```ts
const todos = TodoListSchema.parse(await listTodos());
```

## 2. OpenAPIドキュメントを生成する

APIのパス、HTTPメソッド、レスポンスSchemaは、次のファイルに定義します。

```text
server/handler/openapi.ts
```

Zod Schemaから生成されたOpenAPIドキュメントは、開発サーバー起動後に次のURLで確認できます。

```text
OpenAPI JSON: http://localhost:3000/api/openapi
APIリファレンス: http://localhost:3000/reference
```

## 3. クライアント型定義を生成する

`openApiDocument` から、`openapi-fetch` が使用するTypeScript型を生成します。

```bash
bun api:generate
```

生成先:

```text
apps/web/lib/api/generated.ts
```

APIのZod SchemaまたはOpenAPI定義を変更した場合は、型定義を再生成してください。

## 4. モックサーバーを起動する

Scalar Mock Serverを起動します。

```bash
bun mock
```

モックAPIは次のURLで利用できます。

```text
http://localhost:4010/api/todos
```

モックサーバーをフロントエンドから利用する場合は、`apps/web/.env.local` に次の環境変数を設定します。

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4010
```

## 5. 開発サーバーを起動する

別のターミナルでNext.jsの開発サーバーを起動します。

```bash
bun dev
```

ブラウザで次のURLを開きます。

```text
http://localhost:3000
```

同一オリジンの実APIを利用する場合は、`NEXT_PUBLIC_API_BASE_URL` を空にしてください。

```env
NEXT_PUBLIC_API_BASE_URL=
```
