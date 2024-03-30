import { Message } from "@/types";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  message: Message;
}

const ConfirmDeleteDialog: React.FC<IProps> = ({ isOpen, setIsOpen, message }) => {
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDeleteMessage = async () => {};

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Delete Message?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to permanently delete your message? This can not be undone!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleDeleteMessage} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
