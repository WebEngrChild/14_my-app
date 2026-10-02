import type {
  TodoCreateInput,
  TodoListFilter,
  TodoRepository,
  TodoUpdateInput,
} from "@/server/repository/todo-repository";

/** TODOの操作。HTTP・DB接続・ORMの具体的な実装には依存しない。 */
export class TodoUseCase {
  constructor(private readonly repository: TodoRepository) {}

  async list(filter?: TodoListFilter) {
    return this.repository.list(filter);
  }

  async create(input: TodoCreateInput) {
    return this.repository.create(input);
  }

  async update(id: number, input: TodoUpdateInput) {
    return this.repository.update(id, input);
  }

  async delete(id: number) {
    return this.repository.delete(id);
  }
}
