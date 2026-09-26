import { tagHandler } from "@/server/container";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: RouteContext) {
  return tagHandler.remove(await params);
}
