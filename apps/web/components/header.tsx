"use client";

import { usePathname } from "next/navigation";
import LogoutButton from "./logout-button";

export default function Header() {
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";

  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      <div className="font-bold">My App</div>

      {!isLoginPage && <LogoutButton />}
    </header>
  );
}
