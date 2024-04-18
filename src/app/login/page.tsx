"use client";

import pb from "@/pb";
import { Collections } from "@/types";
import { Email, Google, Key, Person } from "@mui/icons-material";
import { Button, CircularProgress, FormControl, TextField, useTheme } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { ChangeEventHandler, useContext, useEffect, useState } from "react";
import LoginPasswordDialog from "./passwordDialog";
import { AuthMethodsList } from "pocketbase";
import OAuthProvider from "./oAuthProvider";
import { snackbarContext } from "@/components/SnackBar";

const Login: NextPage = () => {
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [authMethods, setAuthMethods] = useState<AuthMethodsList>();
  const { setSnackbar } = useContext(snackbarContext);

  useEffect(() => {
    (async () => {
      try {
        setAuthMethods(await pb.collection(Collections.Users).listAuthMethods());
      } catch {
        setSnackbar({
          message: "Failed to fetch authentication methods!",
          isAlert: true,
          severity: "error",
        });
      }
    })();
  }, []);

  return (
    <>
      <div
        style={{
          width: "100vw",
          height: "calc(100vh - 64px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: ".5rem",
          }}
        >
          {authMethods?.emailPassword ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setPasswordDialogOpen(true);
              }}
              startIcon={<Email />}
            >
              Continue with Email & Password
            </Button>
          ) : authMethods?.usernamePassword ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setPasswordDialogOpen(true);
              }}
              startIcon={<Person />}
            >
              Continue with Username & Password
            </Button>
          ) : (
            <Button disabled variant="contained" color="primary" startIcon={<Key />}>
              Password Authentication Disabled
            </Button>
          )}

          {authMethods?.authProviders.map((provider) => {
            return <OAuthProvider provider={provider} key={provider.name} />;
          })}
        </div>
      </div>
      <LoginPasswordDialog isOpen={passwordDialogOpen} setIsOpen={setPasswordDialogOpen} />
    </>
  );
};

export default Login;
