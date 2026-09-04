import { todos } from "@/server/todos";

export async function GET() {
  return Response.json(todos);
}
