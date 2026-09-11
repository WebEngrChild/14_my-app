import { createMockServer } from "@scalar/mock-server";

import { openApiDocument } from "../server/handler/openapi";

const app = await createMockServer({
  document: openApiDocument,
});

const server = Bun.serve({
  port: 4010,
  fetch: app.fetch,
});

console.log(`Mock server: ${server.url}`);
