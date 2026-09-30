"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type OpenMemoRequest = { id: number; nonce: number };

type MemoSearchContextValue = {
  // nonceで、同じメモを続けて選んでも変更として検知できるようにする。
  openMemoRequest: OpenMemoRequest | null;
  requestOpenMemo: (id: number) => void;
  tagFilter: string | null;
  setTagFilter: (tag: string | null) => void;
};

const MemoSearchContext = createContext<MemoSearchContextValue | null>(null);

export function MemoSearchProvider({ children }: { children: React.ReactNode }) {
  const [openMemoRequest, setOpenMemoRequest] = useState<OpenMemoRequest | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  const requestOpenMemo = useCallback((id: number) => {
    setOpenMemoRequest((previous) => ({ id, nonce: (previous?.nonce ?? 0) + 1 }));
  }, []);

  const value = useMemo(
    () => ({ openMemoRequest, requestOpenMemo, tagFilter, setTagFilter }),
    [openMemoRequest, requestOpenMemo, tagFilter],
  );

  return <MemoSearchContext.Provider value={value}>{children}</MemoSearchContext.Provider>;
}

export function useMemoSearch() {
  const context = useContext(MemoSearchContext);
  if (!context) throw new Error("useMemoSearch は MemoSearchProvider 内で使用してください");
  return context;
}
