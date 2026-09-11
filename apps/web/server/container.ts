import { TodoHandler } from "@/server/handler/todo-handler";
import { db } from "@/server/repository/db";
import { DrizzleTodoRepository } from "@/server/repository/drizzle-todo-repository";
import { TodoUseCase } from "@/server/usecase/todo-usecase";

/** 具体的な依存の組み立てを集約する。 */
export const todoUseCase = new TodoUseCase(new DrizzleTodoRepository(db));
export const todoHandler = new TodoHandler(todoUseCase);
