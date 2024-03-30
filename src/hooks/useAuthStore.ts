import pb from "@/pb";
import { User } from "@/types";
import { AuthModel } from "pocketbase";
import { useEffect, useState } from "react";

interface AuthStore {
  token: string;
  model: AuthModel | User;
}

const useAuthStore = (): [AuthStore, (newAuthStore: AuthStore) => void] => {
  const [authStore, setAuthStore] = useState<AuthStore>({ token: pb.authStore.token, model: pb.authStore.model });

  const handleSetAuthStore = ({ token, model }: AuthStore) => {
    pb.authStore.save(token, model);
  };

  useEffect(() => {
    return pb.authStore.onChange((token, model) => {
      setAuthStore({ token, model });
    });
  }, []);

  return [authStore, handleSetAuthStore];
};

export default useAuthStore;
