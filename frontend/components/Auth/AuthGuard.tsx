"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import { Spinner } from "../common/Spinner";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, accessToken } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isAuthPage = pathname.startsWith("/auth");
    const isPublicPage = pathname === "/" || (pathname.startsWith("/subjects/") && !pathname.includes("/video/"));
    
    if (!isAuthenticated && !isAuthPage && !isPublicPage) {
      router.push("/auth/login");
    } else if (isAuthenticated && isAuthPage) {
      router.push("/");
    }
  }, [isAuthenticated, pathname, router]);

  // Optionally show loader while checking auth if needed
  // For simplicity, we just check isAuthenticated from store
  return <>{children}</>;
};
