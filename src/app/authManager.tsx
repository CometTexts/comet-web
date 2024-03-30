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
    (async () => {
      try {
        await pb.collection(Collections.Users).authRefresh();
      } catch {
        router.replace("/login");
      }
    })();
  }, []);

  useEffect(() => {
    if (pathname === "/login") {
      if (authStore.token) {
        router.replace("/");
      }
    }
  }, [pathname]);

  return children;
};

export default AuthManager;
