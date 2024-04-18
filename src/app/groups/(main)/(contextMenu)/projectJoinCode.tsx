import { snackbarContext } from "@/components/SnackBar";
import { PBEventHandler, pocketBaseHandler } from "@/messageEventHandler";
import pb from "@/pb";
import { Collections, Group, User } from "@/types";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link } from "@mui/material";
import { Roboto_Mono } from "next/font/google";
import { useContext, useEffect, useState } from "react";
import endpoints from "@/endpoints.json";

const RobotoMono = Roboto_Mono({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  group: Group;
}

const ProjectJoinCode: React.FC<IProps> = ({ group, isOpen, setIsOpen }) => {
  const [members, setMembers] = useState(0);
  const { setSnackbar } = useContext(snackbarContext);

  const fetchMembers = async () => {
    try {
      const members = await pb
        .collection(Collections.Users)
        .getFullList({ filter: `joinedGroups.id ?= "${group.id}"` });
      setMembers(members.length);
    } catch (err) {
      console.error(err);
      setSnackbar({
        message: "Failed to fetch members!",
        isAlert: true,
        severity: "error",
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMembers();

      // Events do not work properly: if a user leaves the group an event will not send because the group owner no longer has permission to get events from them. We will just poll the server so this isn't an issue.
      const interval = setInterval(fetchMembers, 2000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const copyJoinCode = async () => {
    try {
      await navigator.clipboard.writeText(group.joinCode);
      handleClose();
      setSnackbar({
        message: "Copied text",
        isAlert: true,
        severity: "info",
      });
    } catch (err) {
      setSnackbar({
        message: "Failed to copy text!",
        isAlert: true,
        severity: "error",
      });
      console.error(err);
    }
  };

  const copyJoinLink = async () => {
    try {
      await navigator.clipboard.writeText(`${endpoints.host}/groups/join/${group.joinCode}`);
      handleClose();
      setSnackbar({
        message: "Copied link",
        isAlert: true,
        severity: "info",
      });
    } catch (err) {
      setSnackbar({
        message: "Failed to copy link!",
        isAlert: true,
        severity: "error",
      });
      console.error(err);
    }
  };

  return (
    <Dialog fullScreen open={isOpen} onClose={handleClose}>
      <DialogTitle>{group.name} Join Code</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <DialogContentText className={RobotoMono.variable} sx={{ fontSize: "100px", fontFamily: `var(--font-mono)` }}>
          {group.joinCode}
        </DialogContentText>
        <DialogContentText>
          <Link href={`${endpoints.host}/groups/join/${group.joinCode}`} target="_blank">
            {endpoints.host}/groups/join/{group.joinCode}
          </Link>
        </DialogContentText>
        <DialogContentText>
          {members} Member{members === 0 || members > 1 ? "s" : ""}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={copyJoinCode}>Copy Code</Button>
        <Button onClick={copyJoinLink}>Copy Link</Button>
        <Button variant="contained" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectJoinCode;
