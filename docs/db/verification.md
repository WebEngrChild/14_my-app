# verification

## verification

### Columns

| Name | Type | Default | Nullable | Children | Parents | Comment |
|------|------|---------|----------|----------|---------|---------|
| **id** | text | - | NO | - | - | - |
| identifier | text | - | NO | - | - | - |
| value | text | - | NO | - | - | - |
| expires_at | timestamp | - | NO | - | - | - |
| created_at | timestamp | `now()` | NO | - | - | - |
| updated_at | timestamp | `now()` | NO | - | - | - |

### Indexes

| Name | Columns | Unique | Type |
|------|---------|--------|------|
| verification_identifier_idx | identifier | NO | - |
