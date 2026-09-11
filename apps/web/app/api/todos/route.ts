import { todoHandler } from "@/server/container";

export async function GET() {
  return todoHandler.list();
}

export async function POST(request: Request) {
  return todoHandler.create(request);
}
