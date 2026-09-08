export interface paths {
    "/api/todos": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** TODO一覧を取得する */
        get: operations["listTodos"];
        put?: never;
        /** TODOを作成する */
        post: operations["createTodo"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** @description TODO */
        Todo: {
            title: string;
            body: string;
        };
        /** @description TODO一覧 */
        TodoList: components["schemas"]["TodoOutput"][];
        /** @description TODO */
        TodoOutput: {
            title: string;
            body: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    listTodos: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description TODO一覧の取得成功 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TodoList"];
                };
            };
        };
    };
    createTodo: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["Todo"];
            };
        };
        responses: {
            /** @description TODOの作成成功 */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TodoOutput"];
                };
            };
        };
    };
}
