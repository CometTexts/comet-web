import { PBEventHandler, pocketBaseHandler } from "@/messageEventHandler";
import pb from "@/pb";
import { User } from "@/types";
import { AuthModel } from "pocketbase";
import { useEffect, useState } from "react";

interface AuthStore {
  token: string;
  model: User;
  isValid: boolean;
  isAdmin: boolean;
}

const useAuthStore = (): [AuthStore, (newAuthStore: AuthStore) => void] => {
  const [authStore, setAuthStore] = useState<AuthStore>({
    token: pb.authStore.token,
    model: pb.authStore.model as User,
    isValid: pb.authStore.isValid,
    isAdmin: pb.authStore.isAdmin,
  });

  const handleSetAuthStore = ({ token, model }: AuthStore) => {
    pb.authStore.save(token, model);
  };

  useEffect(() => {
    const pbUnsubscribe = pb.authStore.onChange((token, model) => {
      setAuthStore({ token, model: model as User, isValid: pb.authStore.isValid, isAdmin: pb.authStore.isAdmin });
    });

    const handleUserEvent: PBEventHandler<User> = ({ action, record }) => {
      if (record.id === authStore.model?.id && action === "update") {
        pb.authStore.save(authStore.token, record);
      }
    };

    pocketBaseHandler.on("userEvent", handleUserEvent);

    return () => {
      pbUnsubscribe();
    };
  }, []);

  return [authStore, handleSetAuthStore];
};

export default useAuthStore;
