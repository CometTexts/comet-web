"use client";

import useAuthStore from "@/hooks/useAuthStore";
import pb from "@/pb";
import { Collections } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const AuthManager: React.FC<React.PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [authStore] = useAuthStore();

  useEffect(() => {
    if (authStore.isValid) {
      if (pathname === "/login") {
        router.replace("/");
      }
    } else {
      if (pathname !== "/login") {
        router.replace("/login");
      }
    }

    if (authStore.isAdmin) {
      if (pathname !== "/admin") {
        router.replace("/admin");
      }
    } else {
      if (pathname === "/admin") {
        if (authStore.isValid) {
          router.replace("/");
        } else {
          router.replace("/login");
        }
      }
    }
  }, [pathname]);

  return children;
};

export default AuthManager;
