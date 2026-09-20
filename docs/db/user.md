# user

## user

### Columns

| Name | Type | Default | Nullable | Children | Parents | Comment |
|------|------|---------|----------|----------|---------|---------|
| **id** | text | - | NO | [account.user_id](./account.md), [session.user_id](./session.md) | - | - |
| name | text | - | NO | - | - | - |
| email | text | - | NO | - | - | - |
| email_verified | boolean | `false` | NO | - | - | - |
| image | text | - | YES | - | - | - |
| created_at | timestamp | `now()` | NO | - | - | - |
| updated_at | timestamp | `now()` | NO | - | - | - |

### Relations

| Parent | Child | Type |
|--------|-------|------|
| **[user.id](./user.md)** | [account.user_id](./account.md) | Many to One |
| **[user.id](./user.md)** | [session.user_id](./session.md) | Many to One |
