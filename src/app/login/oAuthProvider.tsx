import { snackbarContext } from "@/components/SnackBar";
import useAuthStore from "@/hooks/useAuthStore";
import pb from "@/pb";
import { Collections, User } from "@/types";
import { Google } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { AuthProviderInfo } from "pocketbase";
import { useContext } from "react";

interface IProps {
  provider: AuthProviderInfo;
}

const iconMap: { [key: string]: any } = {
  google: <Google />,
};

const OAuthProvider: React.FC<IProps> = ({ provider }) => {
  const router = useRouter();
  const [authStore] = useAuthStore();
  const { setSnackbar } = useContext(snackbarContext);

  const handleOAuth = async () => {
    try {
      const authData = await pb.collection(Collections.Users).authWithOAuth2({ provider: provider.name });
      switch (provider.name) {
        case "google": {
          await pb.collection(Collections.Users).update<User>(authData.record.id, {
            name: authData.meta?.name,
          } as User);
          if (authData.meta?.avatarUrl) {
            const pfp = await fetch(authData.meta?.avatarUrl).then((res) => res.blob());
            const formData = new FormData();
            formData.append("avatar", pfp);
            await pb.collection(Collections.Users).update(authData.record.id, formData);
          }
        }
      }
      setSnackbar({
        message: "Successfully logged in!",
        isAlert: true,
        severity: "success",
      });
      router.replace("/");
    } catch {
      setSnackbar({
        message: "Failed to authenticate!",
        isAlert: true,
        severity: "error",
      });
    }
  };

  return (
    <Button variant="contained" color="secondary" startIcon={iconMap[provider.name]} onClick={handleOAuth}>
      Continue with {provider.displayName}
    </Button>
  );
};

export default OAuthProvider;
