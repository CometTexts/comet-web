import { Message } from "@/types";
import { Delete, Edit } from "@mui/icons-material";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  useTheme,
} from "@mui/material";
import { ReactNode, RefObject, useState } from "react";
import ConfirmDeleteDialog from "./confirmDeleteDialog";
import EditDialog from "./editDialog";

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  anchor: RefObject<any>;
  message: Message;
}

const MessageActionsMenu: React.FC<IProps> = ({ isOpen, setIsOpen, anchor, message }) => {
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [editMessageDialogOpen, setEditMessageDialogOpen] = useState(false);
  const theme = useTheme();

  theme.palette;

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleShowConfirmDeleteDialog = () => {
    handleClose();
    setConfirmDeleteDialogOpen(true);
  };

  const handleShowEditMessageDialog = () => {
    handleClose();
    setEditMessageDialogOpen(true);
  };

  return (
    <>
      <Menu open={isOpen} anchorEl={anchor.current} onClose={handleClose}>
        <MenuList disablePadding>
          <ListItem disableGutters disablePadding>
            <ListItemButton onClick={handleShowEditMessageDialog}>
              <ListItemIcon>
                <Edit />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem disableGutters disablePadding>
            <ListItemButton
              onClick={handleShowConfirmDeleteDialog}
              TouchRippleProps={{ style: { color: theme.palette.error.main } }}
            >
              <ListItemIcon sx={{ color: theme.palette.error.main }}>
                <Delete />
              </ListItemIcon>
              <ListItemText sx={{ color: theme.palette.error.main }}>Delete</ListItemText>
            </ListItemButton>
          </ListItem>
        </MenuList>
      </Menu>
      <ConfirmDeleteDialog isOpen={confirmDeleteDialogOpen} setIsOpen={setConfirmDeleteDialogOpen} message={message} />
      <EditDialog isOpen={editMessageDialogOpen} setIsOpen={setEditMessageDialogOpen} message={message} />
    </>
  );
};

export default MessageActionsMenu;
