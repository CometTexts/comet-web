"use client";

// Lots of this code is just copied from https://mui.com/material-ui/react-snackbar/#consecutive-snackbars

import Snackbar from "@mui/material/Snackbar";
import { Alert, AlertProps } from "@mui/material";
import { useEffect, useState, createContext } from "react";

export interface SnackbarMessage {
  message: React.ReactNode;
  duration?: number;
  action?: React.ReactNode;
  isAlert?: boolean;
  severity?: AlertProps["severity"];
  variant?: AlertProps["variant"];
}

export const snackbarContext = createContext({
  setSnackbar: (message: SnackbarMessage) => {
    console.error("Snackbar Context Has Not Initialized!");
  },
});

const SnackbarProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [snackPack, setSnackPack] = useState<readonly SnackbarMessage[]>([]);
  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState<SnackbarMessage | undefined>(undefined);

  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };

  return (
    <snackbarContext.Provider
      value={{
        setSnackbar: (message: SnackbarMessage) => {
          setSnackPack((prev) => [...prev, message]);
        },
      }}
    >
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
        message={messageInfo?.isAlert ? undefined : messageInfo?.message}
        action={messageInfo?.action}
      >
        {messageInfo?.isAlert ? (
          <Alert onClose={handleClose} severity={messageInfo?.severity} variant={messageInfo?.variant}>
            {messageInfo?.message}
          </Alert>
        ) : undefined}
      </Snackbar>
      {children}
    </snackbarContext.Provider>
  );
};

export default SnackbarProvider;
