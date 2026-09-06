import { writeFile } from "node:fs/promises";
import openapiTS, { astToString } from "openapi-typescript";

import { openApiDocument } from "../server/api/openapi";

const ast = await openapiTS(JSON.stringify(openApiDocument));

await writeFile(
  new URL("../lib/api/generated.ts", import.meta.url),
  astToString(ast),
  "utf8",
);
