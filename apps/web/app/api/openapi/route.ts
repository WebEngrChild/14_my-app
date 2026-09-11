import { openApiDocument } from "@/server/handler/openapi";

export const dynamic = "force-static";

export function GET() {
  return Response.json(openApiDocument);
}
