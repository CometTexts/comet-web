import pb from "@/pb";
import { User } from "@/types";
import { AuthModel } from "pocketbase";
import { useEffect, useState } from "react";

interface AuthStore {
  token: string;
  model: AuthModel | User;
  isValid: boolean;
  isAdmin: boolean;
}

const useAuthStore = (): [AuthStore, (newAuthStore: AuthStore) => void] => {
  const [authStore, setAuthStore] = useState<AuthStore>({
    token: pb.authStore.token,
    model: pb.authStore.model,
    isValid: pb.authStore.isValid,
    isAdmin: pb.authStore.isAdmin,
  });

  const handleSetAuthStore = ({ token, model }: AuthStore) => {
    pb.authStore.save(token, model);
  };

  useEffect(() => {
    return pb.authStore.onChange((token, model) => {
      setAuthStore({ token, model, isValid: pb.authStore.isValid, isAdmin: pb.authStore.isAdmin });
    });
  }, []);

  return [authStore, handleSetAuthStore];
};

export default useAuthStore;
