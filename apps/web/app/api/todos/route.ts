import { listTodos } from "@/server/todos";

export async function GET() {
  const todos = await listTodos();

  return Response.json(todos);
}
