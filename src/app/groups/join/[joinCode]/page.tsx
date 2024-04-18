"use client";

import { snackbarContext } from "@/components/SnackBar";
import useAuthStore from "@/hooks/useAuthStore";
import pb from "@/pb";
import { Collections, Group } from "@/types";
import { CircularProgress, Typography } from "@mui/material";
import { NextPage } from "next";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

interface IParams {
  [key: string]: string;
  joinCode: string;
}

const Page: NextPage = () => {
  const [error, setError] = useState<string>();
  const [authStore] = useAuthStore();
  const { joinCode } = useParams<IParams>();
  const router = useRouter();
  const { setSnackbar } = useContext(snackbarContext);

  useEffect(() => {
    if (authStore.isValid) {
      (async () => {
        const fetchedGroup = await pb
          .collection(Collections.Groups)
          .getFirstListItem<Group>(`joinCode="${joinCode}"`, { headers: { "Join-Code": joinCode } });

        try {
          const user = await pb.collection(Collections.Users).getOne(authStore.model?.id);
          if (user.joinedGroups.includes(fetchedGroup.id)) {
            setError(`Already joined ${fetchedGroup.name}!`);
          } else {
            try {
              await pb.collection(Collections.Users).update(authStore.model?.id, {
                joinedGroups: [...authStore.model?.joinedGroups, fetchedGroup.id],
              });
              router.push(`/groups/${fetchedGroup.id}`);
            } catch {
              setSnackbar({
                message: "Failed to update user data!",
                isAlert: true,
                severity: "error",
              });
            }
          }
        } catch {
          setSnackbar({
            message: "Failed to fetch user!",
            isAlert: true,
            severity: "error",
          });
        }
      })();
    } else {
      router.push(`/login?redirect=${encodeURIComponent(`/groups/join/${joinCode}`)}`);
    }
  }, []);

  return (
    <div
      style={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 64px)",
        gap: "2rem",
      }}
    >
      <Typography variant="h5" fontWeight="bold" sx={{ textAlign: "center" }}>
        {error ?? "Joining Group"}
      </Typography>
      {!error && <CircularProgress />}
    </div>
  );
};

export default Page;
