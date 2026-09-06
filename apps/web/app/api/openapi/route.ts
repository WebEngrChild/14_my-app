import { openApiDocument } from "@/server/api/openapi";

export const dynamic = "force-static";

export function GET() {
  return Response.json(openApiDocument);
}
