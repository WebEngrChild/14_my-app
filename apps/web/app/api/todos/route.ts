import { TodoCreateInput, TodoListSchema } from "@/server/api/schemas/todo";
import { createTodo, listTodos } from "@/server/todos";

export async function GET() {
  const todos = TodoListSchema.parse(await listTodos());

  return Response.json(todos);
}

export async function POST(request: Request) {
  const input = TodoCreateInput.parse(await request.json());
  const todo = await createTodo(input);

  return Response.json(todo, { status: 201 });
}
