import { expect, test } from "bun:test";

import type { TodoRepository } from "@/server/repository/todo-repository";
import { TodoUseCase } from "@/server/usecase/todo-usecase";

function setup(overrides: Partial<TodoRepository> = {}) {
  const repository: TodoRepository = {
    list: async () => [],
    create: async (input) => ({ id: 1, ...input }),
    update: async () => null,
    delete: async () => null,
    ...overrides,
  };
  return new TodoUseCase(repository);
}

test("空文字と空白を含むデータをそのまま返す", async () => {
  const rows = [{ id: 1, title: "  title  ", body: "" }];
  const usecase = setup({ list: async () => rows });
  expect(await usecase.list()).toEqual(rows);
  expect(await usecase.create({ title: "  title  ", body: "" })).toEqual(rows[0]);
});

test("部分更新を事前読取や全項目更新に変換しない", async () => {
  const usecase = setup({
    list: async () => {
      throw new Error("更新前の読取は不要");
    },
    update: async (id, input) => {
      expect(id).toBe(7);
      expect(input).toEqual({ title: "" });
      return { id, title: "", body: "DBの現在値" };
    },
  });
  expect(await usecase.update(7, { title: "" })).toEqual({ id: 7, title: "", body: "DBの現在値" });
});

test("更新・削除の実行時の不在をnullで返す", async () => {
  const usecase = setup();
  expect(await usecase.update(7, { body: "x" })).toBeNull();
  expect(await usecase.delete(7)).toBeNull();
});

test("実際に削除したIDを返す", async () => {
  const usecase = setup({ delete: async (id) => ({ id }) });
  expect(await usecase.delete(7)).toEqual({ id: 7 });
});

test("永続化エラーを成功や不在に置き換えない", async () => {
  const failure = new Error("DB failure");
  const fail = async () => {
    throw failure;
  };
  const usecase = setup({ list: fail, create: fail, update: fail, delete: fail });
  await expect(usecase.list()).rejects.toBe(failure);
  await expect(usecase.create({ title: "", body: "" })).rejects.toBe(failure);
  await expect(usecase.update(1, { title: "" })).rejects.toBe(failure);
  await expect(usecase.delete(1)).rejects.toBe(failure);
});
