import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { ChangeEventHandler, useContext, useState } from "react";
import { MuiOtpInput } from "mui-one-time-password-input";
import pb from "@/pb";
import { Collections, Group, User } from "@/types";
import useAuthStore from "@/hooks/useAuthStore";
import { snackbarContext } from "@/components/SnackBar";

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addGroup: (group: Group) => void;
}

const JoinGroupDialog: React.FC<IProps> = ({ isOpen, setIsOpen, addGroup }) => {
  const [joinCode, setJoinCode] = useState("");
  const [fetchedGroup, setFetchedGroup] = useState<Group>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>("Join Group");
  const [authStore] = useAuthStore();
  const { setSnackbar } = useContext(snackbarContext);

  const handleClose = () => {
    setIsOpen(false);
    setJoinCode("");
  };

  const fetchGroup = async (joinCode: string) => {
    try {
      const newFetchedGroup = await pb
        .collection(Collections.Groups)
        .getFirstListItem<Group>(`joinCode="${joinCode}"`, { headers: { "Join-Code": joinCode } });
      setFetchedGroup(newFetchedGroup);

      if (authStore.model?.joinedGroups.includes(newFetchedGroup.id)) {
        setErrorMessage(`Already Joined ${newFetchedGroup.name}`);
      } else {
        setErrorMessage(undefined);
      }
    } catch {
      setErrorMessage("Group Not Found");
    }
  };

  const handleJoinGroupChange = (value: string) => {
    setJoinCode(value);
    if (value.length === 8) {
      fetchGroup(value);
    } else {
      setFetchedGroup(undefined);
      setErrorMessage("Join Group");
    }
  };

  const handleJoin = async () => {
    const group = await pb
      .collection(Collections.Groups)
      .getFirstListItem<Group>("", { headers: { "Join-Code": joinCode } });
    if (group) {
      // Join group
      try {
        await pb.collection(Collections.Users).update(authStore.model?.id, {
          joinedGroups: [...authStore.model?.joinedGroups, group.id],
        } as User);
        addGroup(group);
        handleClose();
      } catch {
        setSnackbar({
          message: "Failed to join group!",
          isAlert: true,
          severity: "error",
        });
      }
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Join Group</DialogTitle>
      <DialogContent>
        <DialogContentText>Enter a group's join code to join it.</DialogContentText>
        <MuiOtpInput sx={{ marginTop: "1rem" }} value={joinCode} onChange={handleJoinGroupChange} length={8} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button disabled={!!errorMessage} onClick={handleJoin} variant="contained">
          {errorMessage ?? `Join ${fetchedGroup?.name ?? "Group"}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JoinGroupDialog;
