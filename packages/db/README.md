# マイグレーションファイルを生成

```bash
DRIZZLE_ENV_FILE=./apps/web/.env.local bunx drizzle-kit generate
```

# ローカルDBにマイグレーションを適用

```bash
DRIZZLE_ENV_FILE=./apps/web/.env.local bunx drizzle-kit migrate
```

# 本番DBにマイグレーションを適用

```bash
DRIZZLE_ENV_FILE=./apps/web/.env.prd bunx drizzle-kit migrate
```

# マイグレーションファイルを検証

```bash
DRIZZLE_ENV_FILE=./apps/web/.env.local bunx drizzle-kit check
```

# Drizzle Studioを起動

```bash
DRIZZLE_ENV_FILE=./apps/web/.env.local bunx drizzle-kit studio
```

# ローカルDBにseedを実行

```bash
DRIZZLE_ENV_FILE=./apps/web/.env.local bun packages/db/seed.ts
```

# 本番DBにseedを実行

```bash
DRIZZLE_ENV_FILE=./apps/web/.env.prd bun packages/db/seed.ts
```
