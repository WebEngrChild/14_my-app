import { TagHandler } from "@/server/handler/tag-handler";
import { TodoHandler } from "@/server/handler/todo-handler";
import { db } from "@/server/repository/db";
import { DrizzleTagRepository } from "@/server/repository/drizzle-tag-repository";
import { DrizzleTodoRepository } from "@/server/repository/drizzle-todo-repository";
import { TagUseCase } from "@/server/usecase/tag-usecase";
import { TodoUseCase } from "@/server/usecase/todo-usecase";

/** 具体的な依存の組み立てを集約する。 */
export const todoUseCase = new TodoUseCase(new DrizzleTodoRepository(db));
export const todoHandler = new TodoHandler(todoUseCase);
export const tagUseCase = new TagUseCase(new DrizzleTagRepository(db));
export const tagHandler = new TagHandler(tagUseCase);
