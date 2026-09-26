import { tagHandler } from "@/server/container";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  return tagHandler.listForTodo(await params);
}
