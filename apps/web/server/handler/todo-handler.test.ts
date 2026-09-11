import { expect, test } from "bun:test";
import { z } from "zod";

import { TodoHandler } from "@/server/handler/todo-handler";
import type { TodoRepository } from "@/server/repository/todo-repository";
import { TodoUseCase } from "@/server/usecase/todo-usecase";

const todo = { id: 1, title: "  title  ", body: "" };
function setup(overrides: Partial<TodoRepository> = {}) {
  const repository: TodoRepository = {
    list: async () => [todo],
    create: async (input) => ({ id: 1, ...input }),
    update: async () => todo,
    delete: async () => ({ id: 1 }),
    ...overrides,
  };
  return new TodoHandler(new TodoUseCase(repository));
}
const request = (body: unknown) =>
  new Request("http://localhost/api/todos", {
    method: "POST",
    body: JSON.stringify(body),
  });

test("一覧は200で空文字・空白を保持する", async () => {
  const response = await setup().list();
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual([todo]);
});

test("作成は検証済みの入力を渡し201を返す", async () => {
  const response = await setup().create(request({ title: "  title  ", body: "", extra: true }));
  expect(response.status).toBe(201);
  expect(await response.json()).toEqual(todo);
});

test("部分更新はIDを数値化し指定項目だけを渡して200を返す", async () => {
  const handler = setup({
    update: async (id, input) => {
      expect(id).toBe(1);
      expect(input).toEqual({ title: "" });
      return { ...todo, title: "" };
    },
  });
  const response = await handler.update(request({ title: "" }), { id: "1" });
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ ...todo, title: "" });
});

test("不在の更新・削除は本文のない404を返す", async () => {
  const handler = setup({ update: async () => null, delete: async () => null });
  const responses = [
    await handler.update(request({}), { id: "99" }),
    await handler.remove({ id: "99" }),
  ];
  for (const response of responses) {
    expect(response.status).toBe(404);
    expect(await response.text()).toBe("");
  }
});

test("削除は数値IDを渡し本文のない204を返す", async () => {
  const handler = setup({
    delete: async (id) => {
      expect(id).toBe(1);
      return { id };
    },
  });
  const response = await handler.remove({ id: "1" });
  expect(response.status).toBe(204);
  expect(await response.text()).toBe("");
});

test("不正な入力・JSON・出力の例外は変更前どおり伝播する", async () => {
  const handler = setup();
  await expect(handler.create(request({ title: 123, body: "" }))).rejects.toBeInstanceOf(
    z.ZodError,
  );
  await expect(handler.update(request({ body: 123 }), { id: "1" })).rejects.toBeInstanceOf(
    z.ZodError,
  );
  await expect(
    handler.create(new Request("http://localhost", { method: "POST", body: "{" })),
  ).rejects.toBeInstanceOf(SyntaxError);
  const invalid = setup({ list: async () => [{ ...todo, id: 1.5 }] });
  await expect(invalid.list()).rejects.toBeInstanceOf(z.ZodError);
});
