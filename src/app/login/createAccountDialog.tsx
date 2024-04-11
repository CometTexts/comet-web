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
  Link,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { ChangeEvent, ChangeEventHandler, KeyboardEventHandler, useContext, useMemo, useState } from "react";

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setLoginIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fullyCloseLogin: () => void;
  defaultIdentification: string;
  defaultPassword: string;
}

const CreateAccountDialog: React.FC<IProps> = ({
  isOpen,
  setIsOpen,
  setLoginIsOpen,
  fullyCloseLogin,
  defaultIdentification,
  defaultPassword,
}) => {
  const [email, setEmail] = useState(defaultIdentification.includes("@") ? defaultIdentification : "");
  const [name, setName] = useState("");
  const [username, setUsername] = useState(defaultIdentification.includes("@") ? "" : defaultIdentification);
  const [password, setPassword] = useState(defaultPassword ?? "");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { setSnackbar } = useContext(snackbarContext);
  const router = useRouter();

  const openLogin = () => {
    if (!submitting) {
      setIsOpen(false);
      setEmail(defaultIdentification.includes("@") ? defaultIdentification : "");
      setName("");
      setUsername(defaultIdentification.includes("@") ? "" : defaultIdentification);
      setPassword(defaultPassword ?? "");
      setPasswordConfirm("");
      setLoginIsOpen(true);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      fullyCloseLogin();
      setIsOpen(false);
      setEmail(defaultIdentification.includes("@") ? defaultIdentification : "");
      setName("");
      setUsername(defaultIdentification.includes("@") ? "" : defaultIdentification);
      setPassword(defaultPassword ?? "");
      setPasswordConfirm("");
    }
  };

  useMemo(() => {
    setEmail(defaultIdentification.includes("@") ? defaultIdentification : "");
    setUsername(defaultIdentification.includes("@") ? "" : defaultIdentification);
    setPassword(defaultPassword ?? "");
  }, [isOpen, defaultIdentification, defaultPassword]);

  const handleValueChange = (setValue: React.Dispatch<React.SetStateAction<string>>) => {
    const handler: ChangeEventHandler<HTMLInputElement> = (evt) => {
      setValue(evt.target.value);
    };

    return handler;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await pb.collection(Collections.Users).create({
        email,
        name,
        username,
        password,
        passwordConfirm,
      });
      await pb.collection(Collections.Users).authWithPassword(email, password);
      router.replace("/");
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
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Create Account</DialogTitle>
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
              value={email}
              onChange={handleValueChange(setEmail)}
            />
            <TextField
              disabled={submitting}
              label="Name"
              variant="filled"
              value={name}
              onChange={handleValueChange(setName)}
            />
            <TextField
              disabled={submitting}
              label="Username"
              variant="filled"
              value={username}
              onChange={handleValueChange(setUsername)}
            />
            <TextField
              InputProps={{ style: { borderTopLeftRadius: 0, borderTopRightRadius: 0 } }}
              disabled={submitting}
              label="Password"
              type="password"
              variant="filled"
              value={password}
              onChange={handleValueChange(setPassword)}
            />
            <TextField
              InputProps={{ style: { borderTopLeftRadius: 0, borderTopRightRadius: 0 } }}
              disabled={submitting}
              label="Confirm Password"
              type="password"
              variant="filled"
              value={passwordConfirm}
              onChange={handleValueChange(setPasswordConfirm)}
            />
            <DialogContentText>
              Already have an account?{" "}
              <Link href="#" onClick={openLogin}>
                Login.
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
  );
};

export default CreateAccountDialog;
