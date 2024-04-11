"use client";

import { snackbarContext } from "@/components/SnackBar";
import pb from "@/pb";
import { Collections } from "@/types";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  useTheme,
  Link,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { ChangeEventHandler, useContext, useState } from "react";
import CreateAccountDialog from "./createAccountDialog";

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginPasswordDialog: React.FC<IProps> = ({ isOpen, setIsOpen }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showCreateAccountDialog, setShowCreateAccountDialog] = useState(false);
  const { setSnackbar } = useContext(snackbarContext);
  const router = useRouter();

  const handleClose = () => {
    if (!submitting) {
      console.log("fully closing login");
      setIsOpen(false);
      setUsername("");
      setPassword("");
    }
  };

  const handleUsernameChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    setUsername(evt.target.value);
  };

  const handlePasswordChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    setPassword(evt.target.value);
  };

  const openCreateAccountDialog = () => {
    setIsOpen(false);
    setShowCreateAccountDialog(true);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (username.startsWith("admin:")) {
        await pb.admins.authWithPassword(username.split("").splice(6).join(""), password);
        setSnackbar({
          message: "Successfully logged in!",
          isAlert: true,
          severity: "success",
        });
        router.replace("/admin");
      } else {
        await pb.collection(Collections.Users).authWithPassword(username, password);
        setSnackbar({
          message: "Successfully logged in!",
          isAlert: true,
          severity: "success",
        });
        router.replace("/");
      }
    } catch (err: any) {
      setSubmitting(false);
      if (err.message) {
        setSnackbar({
          message: err.message,
          isAlert: true,
          severity: "error",
        });
      } else {
        setSnackbar({
          message: "An unknown error occurred!",
          isAlert: true,
          severity: "error",
        });
      }
    }
  };

  return (
    <>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>Login</DialogTitle>
        <form
          onSubmit={(evt) => {
            evt.preventDefault();
          }}
        >
          <DialogContent>
            <div style={{ display: "flex", flexDirection: "column", width: 350 }}>
              <TextField
                disabled={submitting}
                label="Email"
                variant="filled"
                value={username}
                onChange={handleUsernameChange}
              />
              <TextField
                InputProps={{ style: { borderTopLeftRadius: 0, borderTopRightRadius: 0 } }}
                disabled={submitting}
                label="Password"
                type="password"
                variant="filled"
                value={password}
                onChange={handlePasswordChange}
              />
              <DialogContentText>
                Don't have an account?{" "}
                <Link href="#" onClick={openCreateAccountDialog}>
                  Create one.
                </Link>
              </DialogContentText>
            </div>
          </DialogContent>
          <DialogActions>
            <Button disabled={submitting} onClick={handleClose}>
              Close
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              onClick={handleSubmit}
              sx={{ alignSelf: "flex-end" }}
              variant="contained"
            >
              {submitting ? <CircularProgress size={24} /> : "Login"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <CreateAccountDialog
        isOpen={showCreateAccountDialog}
        setIsOpen={setShowCreateAccountDialog}
        setLoginIsOpen={setIsOpen}
        fullyCloseLogin={handleClose}
        defaultIdentification={username}
        defaultPassword={password}
      />
    </>
  );
};

export default LoginPasswordDialog;
