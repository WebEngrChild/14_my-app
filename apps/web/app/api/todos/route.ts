import { TodoListSchema } from "@/server/api/schemas/todo";
import { listTodos } from "@/server/todos";

export async function GET() {
  const todos = TodoListSchema.parse(await listTodos());

  return Response.json(todos);
}
