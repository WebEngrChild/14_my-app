# todos

## todos

### Columns

| Name | Type | Default | Nullable | Children | Parents | Comment |
|------|------|---------|----------|----------|---------|---------|
| **id** | integer | - | NO | [todo_tags.todo_id](./todo_tags.md) | - | - |
| title | text | - | NO | - | - | - |
| body | text | - | NO | - | - | - |
| created_at | timestamp with time zone | `now()` | NO | - | - | - |
| updated_at | timestamp with time zone | `now()` | NO | - | - | - |

### Relations

| Parent | Child | Type |
|--------|-------|------|
| **[todos.id](./todos.md)** | [todo_tags.todo_id](./todo_tags.md) | Many to One |
