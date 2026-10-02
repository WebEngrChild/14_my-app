import { todoHandler } from "@/server/container";

export async function GET(request: Request) {
  return todoHandler.list(request);
}

export async function POST(request: Request) {
  return todoHandler.create(request);
}
