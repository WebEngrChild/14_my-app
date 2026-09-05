import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "../../../../../../packages/auth";

export const { GET, POST } = toNextJsHandler(auth);
