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

# ローカルDBをDrizzle Studioで開く

```bash
DRIZZLE_ENV_FILE=./apps/web/.env.local bunx drizzle-kit studio
```

# 本番DBをDrizzle Studioで開く

```bash
DRIZZLE_ENV_FILE=./apps/web/.env.prd bunx drizzle-kit studio
```

# ローカルDBにseedを実行

```bash
DRIZZLE_ENV_FILE=./apps/web/.env.local bun packages/db/seed.ts
```

# 本番DBにseedを実行

```bash
DRIZZLE_ENV_FILE=./apps/web/.env.prd bun packages/db/seed.ts
```
