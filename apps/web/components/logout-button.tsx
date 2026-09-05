"use client";

import { useRouter } from "next/navigation";
import { authClient } from "../lib/auth-client";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();

    router.push("/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded bg-black px-4 py-2 text-white"
    >
      ログアウト
    </button>
  );
}
