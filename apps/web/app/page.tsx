import { headers } from "next/headers";
import { redirect } from "next/navigation";

import TodoList from "@/features/todo/components/todo-list";
import { auth } from "@/server/auth";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return <TodoList />;
}
