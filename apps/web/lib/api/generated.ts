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
    "/api/todos/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** TODOを削除する */
        delete: operations["deleteTodo"];
        options?: never;
        head?: never;
        /** TODOを更新する */
        patch: operations["updateTodo"];
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** @description TODO更新入力(部分更新) */
        TodoUpdateInput: {
            title?: string;
            body?: string;
        };
        /** @description TODO一覧 */
        TodoList: components["schemas"]["Todo"][];
        /** @description TODO */
        Todo: {
            id: number;
            title: string;
            body: string;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
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
                    /**
                     * @example [
                     *       {
                     *         "id": 1,
                     *         "title": "買い物リストを更新する",
                     *         "body": "牛乳とパンを買う。帰りにスーパーへ寄る。",
                     *         "createdAt": "2026-09-15T18:15:00+09:00",
                     *         "updatedAt": "2026-09-15T18:15:00+09:00"
                     *       },
                     *       {
                     *         "id": 2,
                     *         "title": "Next.jsのメモ",
                     *         "body": "認証まわりの実装方針を整理する。",
                     *         "createdAt": "2026-09-14T21:30:00+09:00",
                     *         "updatedAt": "2026-09-14T21:30:00+09:00"
                     *       },
                     *       {
                     *         "id": 3,
                     *         "title": "Figmaでメモアプリのデザインを作成…",
                     *         "body": "メモアプリのレイアウトや余白、文字サイズなどを確認して全体のデザインを整えていく…",
                     *         "createdAt": "2026-09-13T19:10:00+09:00",
                     *         "updatedAt": "2026-09-13T19:10:00+09:00"
                     *       }
                     *     ]
                     */
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
                /**
                 * @example {
                 *       "title": "買い物リストを更新する",
                 *       "body": "牛乳とパンを買う。帰りにスーパーへ寄る。"
                 *     }
                 */
                "application/json": {
                    title: string;
                    body: string;
                };
            };
        };
        responses: {
            /** @description TODOの作成成功 */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "id": 1,
                     *       "title": "買い物リストを更新する",
                     *       "body": "牛乳とパンを買う。帰りにスーパーへ寄る。",
                     *       "createdAt": "2026-09-15T18:15:00+09:00",
                     *       "updatedAt": "2026-09-15T18:15:00+09:00"
                     *     }
                     */
                    "application/json": components["schemas"]["Todo"];
                };
            };
        };
    };
    deleteTodo: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description TODOの削除成功 */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description 指定したidのTODOが存在しない */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    updateTodo: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                /**
                 * @example {
                 *       "body": "牛乳とパン、卵を買う。"
                 *     }
                 */
                "application/json": components["schemas"]["TodoUpdateInput"];
            };
        };
        responses: {
            /** @description TODOの更新成功 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "id": 1,
                     *       "title": "買い物リストを更新する",
                     *       "body": "牛乳とパン、卵を買う。",
                     *       "createdAt": "2026-09-15T18:15:00+09:00",
                     *       "updatedAt": "2026-09-16T08:00:00+09:00"
                     *     }
                     */
                    "application/json": components["schemas"]["Todo"];
                };
            };
            /** @description 指定したidのTODOが存在しない */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
}
