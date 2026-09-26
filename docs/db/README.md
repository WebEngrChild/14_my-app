# Tables

| Name | Columns | Comment |
|------|---------|---------|
| [account](./account.md) | 14 |  |
| [session](./session.md) | 8 |  |
| [tags](./tags.md) | 2 |  |
| [todo_tags](./todo_tags.md) | 2 |  |
| [todos](./todos.md) | 5 |  |
| [user](./user.md) | 7 |  |
| [verification](./verification.md) | 6 |  |

---

## ER Diagram

```mermaid
erDiagram
    account }o--|| user : "user_id"
    session }o--|| user : "user_id"
    todo_tags }o--|| todos : "todo_id"
    todo_tags }o--|| tags : "tag_id"

    account {
        text id PK
        text issuer
        text account_id
        text provider_id
        text user_id FK
        text access_token
        text refresh_token
        text id_token
        timestamp access_token_expires_at
        timestamp refresh_token_expires_at
        text scope
        text password
        timestamp created_at
        timestamp updated_at
    }
    session {
        text id PK
        timestamp expires_at
        text token UK
        timestamp created_at
        timestamp updated_at
        text ip_address
        text user_agent
        text user_id FK
    }
    tags {
        int id PK
        text name
    }
    todo_tags {
        int todo_id FK
        int tag_id FK
    }
    todos {
        int id PK
        text title
        text body
        timestamptz created_at
        timestamptz updated_at
    }
    user {
        text id PK
        text name
        text email UK
        boolean email_verified
        text image
        timestamp created_at
        timestamp updated_at
    }
    verification {
        text id PK
        text identifier
        text value
        timestamp expires_at
        timestamp created_at
        timestamp updated_at
    }
```
