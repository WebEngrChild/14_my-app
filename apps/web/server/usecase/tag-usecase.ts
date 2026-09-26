import type { TagRepository } from "@/server/repository/tag-repository";

/** タグの操作。HTTP・DB接続・ORMの具体的な実装には依存しない。 */
export class TagUseCase {
  constructor(private readonly repository: TagRepository) {}

  list(query?: string) {
    return this.repository.list(query);
  }

  create(name: string) {
    return this.repository.create(name);
  }

  delete(id: number) {
    return this.repository.delete(id);
  }

  listForTodo(todoId: number) {
    return this.repository.listForTodo(todoId);
  }

  attach(todoId: number, tagId: number) {
    return this.repository.attach(todoId, tagId);
  }

  detach(todoId: number, tagId: number) {
    return this.repository.detach(todoId, tagId);
  }
}
