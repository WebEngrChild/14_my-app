# account

## account

### Columns

| Name | Type | Default | Nullable | Children | Parents | Comment |
|------|------|---------|----------|----------|---------|---------|
| **id** | text | - | NO | - | - | - |
| issuer | text | - | NO | - | - | - |
| account_id | text | - | NO | - | - | - |
| provider_id | text | - | NO | - | - | - |
| user_id | text | - | NO | - | [user.id](./user.md) | - |
| access_token | text | - | YES | - | - | - |
| refresh_token | text | - | YES | - | - | - |
| id_token | text | - | YES | - | - | - |
| access_token_expires_at | timestamp | - | YES | - | - | - |
| refresh_token_expires_at | timestamp | - | YES | - | - | - |
| scope | text | - | YES | - | - | - |
| password | text | - | YES | - | - | - |
| created_at | timestamp | `now()` | NO | - | - | - |
| updated_at | timestamp | - | NO | - | - | - |

### Constraints

| Name | Type | Definition |
|------|------|------------|
| fk_user_id_user | FOREIGN KEY | (user_id) → user(id) |

### Indexes

| Name | Columns | Unique | Type |
|------|---------|--------|------|
| account_issuer_accountId_uidx | issuer, account_id | YES | - |
| account_userId_idx | user_id | NO | - |

### Relations

| Parent | Child | Type |
|--------|-------|------|
| [user.id](./user.md) | **[account.user_id](./account.md)** | Many to One |
