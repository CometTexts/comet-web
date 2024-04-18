import { snackbarContext } from "@/components/SnackBar";
import useAuthStore from "@/hooks/useAuthStore";
import pb from "@/pb";
import { Collections, Group, User } from "@/types";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useContext } from "react";

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  group: Group;
}

const ConfirmLeaveDialog: React.FC<IProps> = ({ isOpen, setIsOpen, group }) => {
  const [authStore] = useAuthStore();
  const { setSnackbar } = useContext(snackbarContext);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleLeave = async () => {
    if (authStore.model) {
      const newGroups = [...authStore.model.joinedGroups];
      const index = newGroups.findIndex((groupId) => groupId === group.id);
      newGroups.splice(index, 1);

      try {
        await pb.collection(Collections.Users).update(authStore.model.id, {
          joinedGroups: newGroups,
        } as User);
        handleClose();
      } catch {
        setSnackbar({
          message: "Failed to update user data!",
          isAlert: true,
          severity: "error",
        });
      }
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Leave {group.name}?</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you'd like to leave {group.name}?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" color="error" onClick={handleLeave}>
          Leave
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmLeaveDialog;
