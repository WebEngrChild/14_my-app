import {
  TagCreateInput,
  TagIdParam,
  TagListQuery,
  TagListSchema,
  TagSchema,
  TodoTagIdsParam,
} from "@/server/handler/schemas/tag";
import { TodoIdParam } from "@/server/handler/schemas/todo";
import type { TagUseCase } from "@/server/usecase/tag-usecase";

/** 標準のRequest/ResponseでHTTPを扱い、Next.jsには依存しない。 */
export class TagHandler {
  constructor(private readonly usecase: TagUseCase) {}

  async list(request: Request) {
    const query = TagListQuery.parse(Object.fromEntries(new URL(request.url).searchParams));
    const tags = await this.usecase.list(query.query);
    return Response.json(TagListSchema.parse(tags));
  }

  async create(request: Request) {
    const { name } = TagCreateInput.parse(await request.json());
    const tag = await this.usecase.create(name);
    if (!tag) return new Response(null, { status: 409 });
    return Response.json(TagSchema.parse(tag), { status: 201 });
  }

  async remove(params: { id: string }) {
    const { id } = TagIdParam.parse(params);
    const deleted = await this.usecase.delete(id);
    return new Response(null, { status: deleted ? 204 : 404 });
  }

  async listForTodo(params: { id: string }) {
    const { id } = TodoIdParam.parse(params);
    const tags = await this.usecase.listForTodo(id);
    if (!tags) return new Response(null, { status: 404 });
    return Response.json(TagListSchema.parse(tags));
  }

  async attach(params: { id: string; tagId: string }) {
    const { id, tagId } = TodoTagIdsParam.parse(params);
    const attached = await this.usecase.attach(id, tagId);
    return new Response(null, { status: attached ? 204 : 404 });
  }

  async detach(params: { id: string; tagId: string }) {
    const { id, tagId } = TodoTagIdsParam.parse(params);
    const detached = await this.usecase.detach(id, tagId);
    return new Response(null, { status: detached ? 204 : 404 });
  }
}
