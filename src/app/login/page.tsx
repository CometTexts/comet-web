"use client";

import pb from "@/pb";
import { Collections } from "@/types";
import { Email, Google } from "@mui/icons-material";
import { Button, CircularProgress, FormControl, TextField, useTheme } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { ChangeEventHandler, useState } from "react";
import LoginPasswordDialog from "./passwordDialog";

const Login: NextPage = () => {
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

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
          <Button variant="contained" color="secondary" startIcon={<Google />}>
            Continue with Google
          </Button>
        </div>
      </div>
      <LoginPasswordDialog isOpen={passwordDialogOpen} setIsOpen={setPasswordDialogOpen} />
    </>
  );
};

export default Login;
