import { todoHandler } from "@/server/container";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  return todoHandler.update(request, await params);
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  return todoHandler.remove(await params);
}
