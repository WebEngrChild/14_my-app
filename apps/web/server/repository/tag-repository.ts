import type { Tag } from "@/server/domain/tag";

/** タグとメモへの付与を扱う永続化契約。 */
export interface TagRepository {
  list(query?: string): Promise<Tag[]>;
  /** 同じ名前のタグがある場合はnull。 */
  create(name: string): Promise<Tag | null>;
  delete(id: number): Promise<boolean>;
  /** メモが存在しない場合はnull。 */
  listForTodo(todoId: number): Promise<Tag[] | null>;
  /** メモかタグが存在しない場合はfalse。重複付与は成功とする。 */
  attach(todoId: number, tagId: number): Promise<boolean>;
  /** メモかタグが存在しない場合はfalse。既に外れている場合は成功とする。 */
  detach(todoId: number, tagId: number): Promise<boolean>;
}
