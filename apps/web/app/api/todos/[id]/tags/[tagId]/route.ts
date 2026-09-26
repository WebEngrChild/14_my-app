import { tagHandler } from "@/server/container";

type RouteContext = { params: Promise<{ id: string; tagId: string }> };

export async function PUT(_request: Request, { params }: RouteContext) {
  return tagHandler.attach(await params);
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  return tagHandler.detach(await params);
}
