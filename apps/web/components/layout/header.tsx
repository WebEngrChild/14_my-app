"use client";

import { usePathname } from "next/navigation";
import LogoutButton from "@/features/auth/components/logout-button";
import HeaderSearch from "./header-search";

export default function Header() {
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";

  return (
    <header className="flex items-center justify-between gap-4 border-b px-6 py-4">
      <div className="font-bold">My App</div>

      {!isLoginPage && <HeaderSearch />}

      {!isLoginPage && <LogoutButton />}
    </header>
  );
}
