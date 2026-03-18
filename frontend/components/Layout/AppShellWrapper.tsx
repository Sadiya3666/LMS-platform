"use client";

import { usePathname } from "next/navigation";
import { AppShell } from "./AppShell";

export const AppShellWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");

  if (isAuthPage) {
    return <main className="min-h-screen w-full bg-[#0F172A]">{children}</main>;
  }

  return <AppShell>{children}</AppShell>;
};
