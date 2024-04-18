import { snackbarContext } from "@/components/SnackBar";
import pb from "@/pb";
import { Collections, Message } from "@/types";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { ChangeEventHandler, EventHandler, useContext, useMemo, useState } from "react";

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  message: Message;
}

const EditDialog: React.FC<IProps> = ({ isOpen, setIsOpen, message }) => {
  const [messageText, setMessageText] = useState(message.text === "$^attachment-only^$" ? "" : message.text);
  const { setSnackbar } = useContext(snackbarContext);

  const handleClose = () => {
    setMessageText(message.text === "$^attachment-only^$" ? "" : message.text);
    setIsOpen(false);
  };

  const handleEdit = async () => {
    try {
      await pb.collection(Collections.Messages).update(message.id, {
        text: messageText.trim() === "" && message.attachment !== "" ? "$^attachment-only^$" : messageText.trim(),
      } as Message);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      setSnackbar({
        message: "Failed to edit message!",
        isAlert: true,
        severity: "error",
      });
    }
  };

  const handleMessageEdit: ChangeEventHandler<HTMLInputElement> = (evt) => {
    setMessageText(evt.target.value);
  };

  useMemo(() => {
    setMessageText(message.text === "$^attachment-only^$" ? "" : message.text);
  }, [message.text, isOpen]);

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth>
      <DialogTitle>Edit Message</DialogTitle>
      <DialogContent>
        <TextField variant="filled" label="Edit Message" value={messageText} onChange={handleMessageEdit} fullWidth />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleEdit}
          disabled={messageText.trim() === "" && message.attachment === ""}
        >
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
