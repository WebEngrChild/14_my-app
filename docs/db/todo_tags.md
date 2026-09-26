# todo_tags

## todo_tags

### Columns

| Name | Type | Default | Nullable | Children | Parents | Comment |
|------|------|---------|----------|----------|---------|---------|
| todo_id | integer | - | NO | - | [todos.id](./todos.md) | - |
| tag_id | integer | - | NO | - | [tags.id](./tags.md) | - |

### Constraints

| Name | Type | Definition |
|------|------|------------|
| pk_todo_id_tag_id | PRIMARY KEY | (todo_id, tag_id) |
| fk_todo_id_todos | FOREIGN KEY | (todo_id) → todos(id) |
| fk_tag_id_tags | FOREIGN KEY | (tag_id) → tags(id) |

### Indexes

| Name | Columns | Unique | Type |
|------|---------|--------|------|
| todo_tags_tag_id_idx | tag_id | NO | - |

### Relations

| Parent | Child | Type |
|--------|-------|------|
| [todos.id](./todos.md) | **[todo_tags.todo_id](./todo_tags.md)** | Many to One |
| [tags.id](./tags.md) | **[todo_tags.tag_id](./todo_tags.md)** | Many to One |
