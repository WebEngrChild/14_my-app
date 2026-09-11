import type { Todo } from "@/server/domain/todo";

export type TodoCreateInput = Omit<Todo, "id">;
export type TodoUpdateInput = Partial<TodoCreateInput>;

/** TODOの永続化契約。HTTPやORM固有の型には依存しない。 */
export interface TodoRepository {
  list(): Promise<Todo[]>;
  create(input: TodoCreateInput): Promise<Todo>;
  /** 指定された項目だけを更新し、実行時に対象がなければnullを返す。 */
  update(id: number, input: TodoUpdateInput): Promise<Todo | null>;
  /** 実際に削除したIDを返し、対象がなければnullを返す。 */
  delete(id: number): Promise<Pick<Todo, "id"> | null>;
}
