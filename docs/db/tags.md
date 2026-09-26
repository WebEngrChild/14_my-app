# tags

## tags

### Columns

| Name | Type | Default | Nullable | Children | Parents | Comment |
|------|------|---------|----------|----------|---------|---------|
| **id** | integer | - | NO | [todo_tags.tag_id](./todo_tags.md) | - | - |
| name | text | - | NO | - | - | - |

### Indexes

| Name | Columns | Unique | Type |
|------|---------|--------|------|
| tags_name_uidx | name | YES | - |

### Relations

| Parent | Child | Type |
|--------|-------|------|
| **[tags.id](./tags.md)** | [todo_tags.tag_id](./todo_tags.md) | Many to One |
