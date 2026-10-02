import { afterAll, expect, test } from "bun:test";

import { createDb, type Db } from "@my-app/db";
import { tags, todoTags } from "@my-app/db/schema";

import type { Todo } from "@/server/domain/todo";
import { DrizzleTodoRepository } from "@/server/repository/drizzle-todo-repository";

// 実DBに接続する。各テストのデータはトランザクションごとロールバックして残さない。
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URLが未設定です");
const db = createDb(databaseUrl);
afterAll(() => db.$client.end());

class Rollback extends Error {}

async function inRollback(fn: (tx: Db) => Promise<void>) {
  await db
    .transaction(async (tx) => {
      await fn(tx);
      throw new Rollback();
    })
    .catch((error) => {
      if (!(error instanceof Rollback)) throw error;
    });
}

// 既存データと混ざらないよう一意な目印を付ける。同一トランザクション内は作成時刻が同じため、並びはID降順になる。
async function seed(tx: Db) {
  const mark = `itest-${crypto.randomUUID()}`;
  const repository = new DrizzleTodoRepository(tx);
  const a = await repository.create({ title: `${mark} 買い物`, body: "牛乳" });
  const b = await repository.create({ title: "メモ", body: `${mark} 認証の方針` });
  const c = await repository.create({ title: `${mark}_x`, body: "" });
  const d = await repository.create({ title: `${mark}ax`, body: "" });
  const [work, related] = await tx
    .insert(tags)
    .values([{ name: `${mark}仕事` }, { name: `${mark}仕事関連` }])
    .returning();
  await tx.insert(todoTags).values([
    { todoId: a.id, tagId: work.id },
    { todoId: a.id, tagId: related.id },
    { todoId: b.id, tagId: related.id },
  ]);
  return { mark, repository, a, b, c, d, work: work.name, related: related.name };
}

const ids = (todos: Todo[]) => todos.map((todo) => todo.id);

test("qはタイトル・本文の部分一致で絞り込む", () =>
  inRollback(async (tx) => {
    const { mark, repository, a, b, c, d } = await seed(tx);
    expect(ids(await repository.list({ q: mark }))).toEqual([d.id, c.id, b.id, a.id]);
    expect(ids(await repository.list({ q: `${mark} 買い` }))).toEqual([a.id]);
  }));

test("qの%や_はワイルドカードではなく文字として扱う", () =>
  inRollback(async (tx) => {
    const { mark, repository, c } = await seed(tx);
    expect(ids(await repository.list({ q: `${mark}_` }))).toEqual([c.id]);
    expect(await repository.list({ q: `${mark}%` })).toEqual([]);
  }));

test("tagはタグ名の完全一致で絞り込み、複数タグでも重複しない", () =>
  inRollback(async (tx) => {
    const { mark, repository, a, b, work, related } = await seed(tx);
    expect(ids(await repository.list({ tag: work }))).toEqual([a.id]);
    expect(ids(await repository.list({ tag: related }))).toEqual([b.id, a.id]);
    expect(await repository.list({ tag: `${mark}仕` })).toEqual([]);
  }));

test("qとtagの両方を指定するとANDで絞り込む", () =>
  inRollback(async (tx) => {
    const { repository, a, related, work } = await seed(tx);
    expect(ids(await repository.list({ q: "買い物", tag: related }))).toEqual([a.id]);
    expect(await repository.list({ q: "認証", tag: work })).toEqual([]);
  }));

test("空文字は未指定と同じく全件を返す", () =>
  inRollback(async (tx) => {
    const { repository } = await seed(tx);
    expect(await repository.list({ q: "", tag: "" })).toEqual(await repository.list());
  }));
