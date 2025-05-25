"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "./sidebar";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide sidebar on auth pages
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return <AppSidebar>{children}</AppSidebar>;
}
