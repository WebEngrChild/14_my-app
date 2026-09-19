import type { components } from "@/lib/api/generated";

export type MemoInput = Pick<components["schemas"]["Todo"], "title" | "body">;
export type SaveStatus = "idle" | "pending" | "saving" | "success" | "error";
export type SaveStates = Partial<Record<number, SaveStatus>>;

export type MemoSaver = (request: {
  localId: number;
  input: MemoInput;
  isNew: boolean;
  signal: AbortSignal;
}) => Promise<void>;
