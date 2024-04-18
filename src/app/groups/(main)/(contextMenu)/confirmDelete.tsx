import { snackbarContext } from "@/components/SnackBar";
import pb from "@/pb";
import { Collections, Group } from "@/types";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { ChangeEventHandler, useContext, useState } from "react";

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  group: Group;
}

const ConfirmDeleteDialog: React.FC<IProps> = ({ isOpen, setIsOpen, group }) => {
  const [confirmGroupName, setConfirmGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const { setSnackbar } = useContext(snackbarContext);

  const handleConfirmGroupNameChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    setConfirmGroupName(evt.target.value);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await pb.collection(Collections.Groups).delete(group.id);
      handleClose();
      setSnackbar({
        message: `Successfully deleted ${group.name}`,
        isAlert: true,
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        message: "Failed to delete group!",
        isAlert: true,
        severity: "error",
      });
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Delete Group?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you'd like to delete {group.name}? This will delete all messages and remove all users from the
          group.
        </DialogContentText>
        <DialogContentText>Please type "{group.name}" below to continue.</DialogContentText>
        <TextField
          variant="filled"
          label={`"${group.name}"`}
          fullWidth
          value={confirmGroupName}
          onChange={handleConfirmGroupNameChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button color="error" variant="contained" onClick={handleDelete} disabled={confirmGroupName !== group.name}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
