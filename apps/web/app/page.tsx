import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "../../../packages/auth";
import HomeClient from "./home-client";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return <HomeClient />;
}
