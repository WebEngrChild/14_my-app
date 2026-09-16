import { headers } from "next/headers";
import { redirect } from "next/navigation";

import MemoApp from "@/features/todo/components/memo-app";
import { auth } from "@/server/auth";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return <MemoApp />;
}
