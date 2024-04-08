import { Group } from "@/types";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  group: Group;
}

const ConfirmDeleteDialog: React.FC<IProps> = ({ isOpen, setIsOpen, group }) => {
  const [formIsValid, setFormIsValid] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Delete Group?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you'd like to delete {group.name}? This will delete all messages and remove all users from the
          group.
        </DialogContentText>
        <DialogContentText>
          Please type "{group.name}" and your password in the below text boxes to continue.
        </DialogContentText>
        <TextField variant="filled" label={group.name} fullWidth />
        <TextField
          variant="filled"
          type="password"
          label="Confirm Password"
          InputProps={{ style: { borderRadius: 0 } }}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
