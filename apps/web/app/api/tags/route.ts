import { tagHandler } from "@/server/container";

export async function GET(request: Request) {
  return tagHandler.list(request);
}

export async function POST(request: Request) {
  return tagHandler.create(request);
}
