import { Group } from "@/types";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  group: Group;
}

const EditGroupDialog: React.FC<IProps> = ({ isOpen, setIsOpen, group }) => {
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle></DialogTitle>
      <DialogContent>
        <DialogContentText></DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained"></Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditGroupDialog;
