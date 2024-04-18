import { snackbarContext } from "@/components/SnackBar";
import pb from "@/pb";
import { Collections, Message } from "@/types";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useContext, useState } from "react";

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  message: Message;
}

const ConfirmDeleteDialog: React.FC<IProps> = ({ isOpen, setIsOpen, message }) => {
  const [isDeletingMessage, setIsDeletingMessage] = useState(false);
  const { setSnackbar } = useContext(snackbarContext);

  const handleClose = () => {
    if (!isDeletingMessage) {
      setIsOpen(false);
    }
  };

  const handleDeleteMessage = async () => {
    setIsDeletingMessage(true);
    try {
      await pb.collection(Collections.Messages).delete(message.id);
      setIsDeletingMessage(false);
      handleClose();
    } catch (err) {
      console.error(err);
      setSnackbar({
        message: "Failed to delete message!",
        isAlert: true,
        severity: "error",
      });
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Delete Message?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to permanently delete your message? This can not be undone!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button disabled={isDeletingMessage} onClick={handleClose}>
          Cancel
        </Button>
        <Button disabled={isDeletingMessage} onClick={handleDeleteMessage} color="error" variant="contained">
          {isDeletingMessage ? <CircularProgress size={24} /> : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
