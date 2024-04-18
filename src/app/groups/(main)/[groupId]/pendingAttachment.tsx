import { AudioFile, Close, Image, InsertDriveFile, VideoFile } from "@mui/icons-material";
import { IconButton, Paper, SvgIconTypeMap, Tooltip, Typography, useTheme } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { useState } from "react";

interface IProps {
  file: File;
  index: number;
  setFileList: React.Dispatch<React.SetStateAction<File[]>>;
}

const iconMap: {
  [key: string]: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
} = {
  image: Image,
  video: VideoFile,
  audio: AudioFile,
};

const PendingAttachment: React.FC<IProps> = ({ file, index, setFileList }) => {
  const [imageFailedToLoad, setImageFailedToLoad] = useState(false);
  const theme = useTheme();

  const Icon = iconMap[file.type.split("/")[0]] ?? InsertDriveFile;

  const removeAttachment = () => {
    setFileList((files) => {
      const newFiles = [...files];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleImageError = () => {
    setImageFailedToLoad(true);
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        // margin: "1rem",
        padding: "1rem",
        aspectRatio: 1,
        height: "150px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: ".5rem",
        position: "relative",
        ":hover": {
          "#close": {
            opacity: 1,
          },
        },
      }}
    >
      <Paper
        variant="elevation"
        id="close"
        sx={{
          opacity: 0,
          transition: theme.transitions.create("opacity"),
          borderRadius: "100%",
          position: "absolute",
          top: ".5rem",
          right: ".5rem",
        }}
      >
        <Tooltip title="Remove Attachment">
          <IconButton size="small" color="error" onClick={removeAttachment}>
            <Close />
          </IconButton>
        </Tooltip>
      </Paper>
      {file.type.startsWith("image") && !imageFailedToLoad ? (
        <img
          src={URL.createObjectURL(file)}
          onError={handleImageError}
          style={{ maxWidth: "116px", maxHeight: "80px" }}
        />
      ) : (
        <Icon sx={{ fontSize: "80px", width: "100%" }} />
      )}
      <Tooltip title={file.name}>
        <Typography sx={{ width: "100%", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
          {file.name}
        </Typography>
      </Tooltip>
    </Paper>
  );
};

export default PendingAttachment;
