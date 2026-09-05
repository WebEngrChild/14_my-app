# マイグレーションファイルを生成

```bash
bunx drizzle-kit generate
```

# ローカルDBにマイグレーションを適用

```bash
bunx drizzle-kit migrate
```

# 本番DBにマイグレーションを適用

```bash
bun --env-file=.env.prd x drizzle-kit migrate
```

# マイグレーションファイルを検証

```bash
bunx drizzle-kit check
```

# Drizzle Studioを起動

```bash
bunx drizzle-kit studio
```

# seedを実行

```bash
bun packages/db/seed.ts
```
