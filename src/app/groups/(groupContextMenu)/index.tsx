import useAuthStore from "@/hooks/useAuthStore";
import { Group } from "@/types";
import { ContentCopy, Delete, Edit, Logout } from "@mui/icons-material";
import { Divider, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, useTheme } from "@mui/material";
import { useState } from "react";
import ConfirmDeleteDialog from "./confirmDelete";
import GroupInfoDialog from "@/components/GroupInfoDialog";

interface IProps {
  position: [number, number];
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  group: Group;
}

const GroupListItemRightClickMenu: React.FC<IProps> = ({ position, isOpen, setIsOpen, group }) => {
  const [showLeaveGroupDialog, setShowLeaveGroupDialog] = useState(false);
  const [showDeleteGroupDialog, setShowDeleteGroupDialog] = useState(false);
  const [showEditGroupDialog, setShowEditGroupDialog] = useState(false);
  const [authStore] = useAuthStore();
  const theme = useTheme();

  const handleClose = () => {
    setIsOpen(false);
  };

  const leaveGroup = () => {
    setShowLeaveGroupDialog(true);
    handleClose();
  };

  const deleteGroup = () => {
    setShowDeleteGroupDialog(true);
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
      //TODO: show success toast
    } catch (err) {
      //TODO: display to user
      console.error(err);
    }
  };

  return (
    <>
      <Menu
        open={isOpen}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={{ left: position[0], top: position[1] }}
      >
        <MenuList disablePadding>
          <MenuItem onClick={copyJoinCode}>
            <ListItemIcon>
              <ContentCopy />
            </ListItemIcon>
            <ListItemText>Copy Join Code</ListItemText>
          </MenuItem>
          <Divider />
          {group.owner === authStore.model?.id ? (
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
              <MenuItem TouchRippleProps={{ style: { color: theme.palette.error.main } }}>
                <ListItemIcon>
                  <Logout sx={{ color: theme.palette.error.main }} />
                </ListItemIcon>
                <ListItemText sx={{ color: theme.palette.error.main }}>Leave Group</ListItemText>
              </MenuItem>
            </>
          )}
        </MenuList>
      </Menu>
      <ConfirmDeleteDialog isOpen={showDeleteGroupDialog} setIsOpen={setShowDeleteGroupDialog} group={group} />
      <GroupInfoDialog
        isOpen={showEditGroupDialog}
        setIsOpen={setShowEditGroupDialog}
        variant="update"
        existingGroupId={group.id}
      />
    </>
  );
};

export default GroupListItemRightClickMenu;
