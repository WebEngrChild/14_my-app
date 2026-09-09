import { TodoSchema, TodoUpdateInput } from "@/server/api/schemas/todo";
import { updateTodo } from "@/server/todos";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const input = TodoUpdateInput.parse(await request.json());
  const todo = await updateTodo(Number(id), input);

  if (!todo) {
    return new Response(null, { status: 404 });
  }

  return Response.json(TodoSchema.parse(todo));
}
