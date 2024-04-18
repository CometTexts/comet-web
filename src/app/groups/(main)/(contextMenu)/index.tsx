import useAuthStore from "@/hooks/useAuthStore";
import { Group } from "@/types";
import { Cast, ContentCopy, Delete, Edit, Link, Logout } from "@mui/icons-material";
import { Divider, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import ConfirmDeleteDialog from "./confirmDelete";
import GroupInfoDialog from "@/components/GroupInfoDialog";
import { snackbarContext } from "@/components/SnackBar";
import ProjectJoinCode from "./projectJoinCode";
import endpoints from "@/endpoints.json";
import ConfirmLeaveDialog from "./confirmLeave";

interface IProps {
  position: [number, number];
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  group: Group;
}

const GroupListItemRightClickMenu: React.FC<IProps> = ({ position, isOpen, setIsOpen, group }) => {
  const [showProjectJoinCodeDialog, setShowProjectJoinCodeDialog] = useState(false);
  const [showConfirmLeaveGroupDialog, setShowConfirmLeaveGroupDialog] = useState(false);
  const [showConfirmDeleteGroupDialog, setShowConfirmDeleteGroupDialog] = useState(false);
  const [showEditGroupDialog, setShowEditGroupDialog] = useState(false);
  const [authStore] = useAuthStore();
  const { setSnackbar } = useContext(snackbarContext);
  const theme = useTheme();

  const handleClose = () => {
    setIsOpen(false);
  };

  const openProjectJoinCodeDialog = () => {
    setShowProjectJoinCodeDialog(true);
    handleClose();
  };

  const deleteGroup = () => {
    setShowConfirmDeleteGroupDialog(true);
    handleClose();
  };

  const leaveGroup = () => {
    setShowConfirmLeaveGroupDialog(true);
    handleClose();
  };

  const editGroup = () => {
    setShowEditGroupDialog(true);
    handleClose();
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

  const isOwner = group.owner === authStore.model?.id;

  return (
    <>
      <Menu
        open={isOpen}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={{ left: position[0], top: position[1] }}
      >
        <MenuList disablePadding>
          {isOwner ? (
            <>
              <MenuItem onClick={openProjectJoinCodeDialog}>
                <ListItemIcon>
                  <Cast />
                </ListItemIcon>
                <ListItemText>Project Join Code</ListItemText>
              </MenuItem>
            </>
          ) : (
            <></>
          )}
          <MenuItem onClick={copyJoinCode}>
            <ListItemIcon>
              <ContentCopy />
            </ListItemIcon>
            <ListItemText>Copy Join Code</ListItemText>
          </MenuItem>
          <MenuItem onClick={copyJoinLink}>
            <ListItemIcon>
              <Link />
            </ListItemIcon>
            <ListItemText>Copy Join Link</ListItemText>
          </MenuItem>
          <Divider />
          {isOwner ? (
            <>
              <MenuItem onClick={editGroup}>
                <ListItemIcon>
                  <Edit />
                </ListItemIcon>
                <ListItemText>Edit Group</ListItemText>
              </MenuItem>
              <MenuItem onClick={deleteGroup} TouchRippleProps={{ style: { color: theme.palette.error.main } }}>
                <ListItemIcon>
                  <Delete sx={{ color: theme.palette.error.main }} />
                </ListItemIcon>
                <ListItemText sx={{ color: theme.palette.error.main }}>Delete Group</ListItemText>
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem onClick={leaveGroup} TouchRippleProps={{ style: { color: theme.palette.error.main } }}>
                <ListItemIcon>
                  <Logout sx={{ color: theme.palette.error.main }} />
                </ListItemIcon>
                <ListItemText sx={{ color: theme.palette.error.main }}>Leave Group</ListItemText>
              </MenuItem>
            </>
          )}
        </MenuList>
      </Menu>
      <ProjectJoinCode isOpen={showProjectJoinCodeDialog} setIsOpen={setShowProjectJoinCodeDialog} group={group} />
      <GroupInfoDialog
        isOpen={showEditGroupDialog}
        setIsOpen={setShowEditGroupDialog}
        variant="update"
        existingGroupId={group.id}
      />
      <ConfirmLeaveDialog
        isOpen={showConfirmLeaveGroupDialog}
        setIsOpen={setShowConfirmLeaveGroupDialog}
        group={group}
      />
      <ConfirmDeleteDialog
        isOpen={showConfirmDeleteGroupDialog}
        setIsOpen={setShowConfirmDeleteGroupDialog}
        group={group}
      />
    </>
  );
};

export default GroupListItemRightClickMenu;
