import {
  TodoCreateInput,
  TodoListSchema,
  TodoSchema,
  TodoUpdateInput,
} from "@/server/handler/schemas/todo";
import type { TodoUseCase } from "@/server/usecase/todo-usecase";

/** 標準のRequest/ResponseでHTTPを扱い、Next.jsには依存しない。 */
export class TodoHandler {
  constructor(private readonly usecase: TodoUseCase) {}

  async list() {
    const todos = TodoListSchema.parse(await this.usecase.list());
    return Response.json(todos);
  }

  async create(request: Request) {
    const input = TodoCreateInput.parse(await request.json());
    const todo = await this.usecase.create(input);
    return Response.json(todo, { status: 201 });
  }

  async update(request: Request, params: { id: string }) {
    const input = TodoUpdateInput.parse(await request.json());
    const todo = await this.usecase.update(Number(params.id), input);
    if (!todo) return new Response(null, { status: 404 });
    return Response.json(TodoSchema.parse(todo));
  }

  async remove(params: { id: string }) {
    const todo = await this.usecase.delete(Number(params.id));
    if (!todo) return new Response(null, { status: 404 });
    return new Response(null, { status: 204 });
  }
}
