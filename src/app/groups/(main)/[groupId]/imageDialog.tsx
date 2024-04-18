import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filename: string;
  url: string;
}

const ImageDialog: React.FC<IProps> = ({ isOpen, setIsOpen, filename, url }) => {
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} sx={{ maxWidth: "100%", maxHeight: "100%" }}>
      <DialogTitle>{filename}</DialogTitle>
      <DialogContent>
        <img src={url} style={{ maxHeight: "100vh" }} />
      </DialogContent>
      <DialogActions>
        <Button href={url} target="_blank">
          Open Original
        </Button>
        <Button variant="contained" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageDialog;
