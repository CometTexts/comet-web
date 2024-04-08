import useAuthStore from "@/hooks/useAuthStore";
import pb from "@/pb";
import { Collections, User } from "@/types";
import { Google } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { AuthProviderInfo } from "pocketbase";

interface IProps {
  provider: AuthProviderInfo;
}

const iconMap: { [key: string]: any } = {
  google: <Google />,
};

const OAuthProvider: React.FC<IProps> = ({ provider }) => {
  const router = useRouter();
  const [authStore] = useAuthStore();

  const handleOAuth = async () => {
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
    router.replace("/");
  };

  return (
    <Button variant="contained" color="secondary" startIcon={iconMap[provider.name]} onClick={handleOAuth}>
      Continue with {provider.displayName}
    </Button>
  );
};

export default OAuthProvider;
