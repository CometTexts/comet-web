"use client";

import pb from "@/pb";
import { Collections } from "@/types";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { ChangeEventHandler, useState } from "react";

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginPasswordDialog: React.FC<IProps> = ({ isOpen, setIsOpen }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const theme = useTheme();
  const router = useRouter();

  const handleClose = () => {
    if (!submitting) {
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

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await pb.collection(Collections.Users).authWithPassword(username, password);
      router.replace("/");
    } catch (err) {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Login</DialogTitle>
      <form
        onSubmit={(evt) => {
          evt.preventDefault();
        }}
      >
        <DialogContent>
          <div style={{ display: "flex", flexDirection: "column", width: 350 }}>
            <TextField disabled={submitting} label="Email" variant="filled" onChange={handleUsernameChange} />
            <TextField
              InputProps={{ style: { borderTopLeftRadius: 0, borderTopRightRadius: 0 } }}
              disabled={submitting}
              label="Password"
              type="password"
              variant="filled"
              onChange={handlePasswordChange}
            />
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

export default LoginPasswordDialog;
