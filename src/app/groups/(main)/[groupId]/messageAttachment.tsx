import { snackbarContext } from "@/components/SnackBar";
import pb from "@/pb";
import { AttachmentType, Message } from "@/types";
import { InsertDriveFile } from "@mui/icons-material";
import { Link, Paper, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ReactEventHandler, useContext, useEffect, useState } from "react";
import ImageDialog from "./imageDialog";

interface IProps {
  variant: AttachmentType;
  label: string;
  record: Message;
}

const MessageAttachment: React.FC<IProps> = ({ variant, label, record }) => {
  const { setSnackbar } = useContext(snackbarContext);
  const [url, setUrl] = useState(pb.files.getUrl(record, label));
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [forceFileDisplay, setForceFileDisplay] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const theme = useTheme();

  const updateUrl = async () => {
    try {
      const token = await pb.files.getToken();
      setUrl(pb.files.getUrl(record, label, { token }));
    } catch (err) {
      console.error(err);
      setSnackbar({
        message: "Failed to fetch attachment URL token!",
        isAlert: true,
        severity: "error",
      });
    }
  };

  useEffect(() => {
    updateUrl();

    const interval = setInterval(updateUrl, 120000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const openFile = async () => {
    window.open(url, "_blank");
  };

  const openImageDialog = () => {
    setImageDialogOpen(true);
  };

  const handleError: ReactEventHandler<HTMLImageElement | HTMLVideoElement | HTMLAudioElement> = async (evt) => {
    console.log(retryCount);

    if (retryCount >= 1) {
      console.error("Failed to load", evt);
      setForceFileDisplay(true);
    } else {
      setRetryCount((currentCount) => currentCount + 1);
      await updateUrl();
    }
  };

  if (variant === "image" && !forceFileDisplay) {
    return (
      <>
        <img
          src={url}
          style={{ cursor: "pointer", maxWidth: "100%", maxHeight: "35vh" }}
          onClick={openImageDialog}
          onError={handleError}
        />
        <ImageDialog isOpen={imageDialogOpen} setIsOpen={setImageDialogOpen} filename={label} url={url} />
      </>
    );
  } else if (variant === "video" && !forceFileDisplay) {
    return <video src={url} controls style={{ maxWidth: "100%", maxHeight: "35vh" }} onError={handleError} />;
  } else if (variant === "audio" && !forceFileDisplay) {
    return <audio src={url} controls style={{ maxWidth: "100%" }} onError={handleError} />;
  } else {
    return (
      <>
        <Paper
          variant="outlined"
          sx={{
            display: "inline-flex",
            padding: "1rem",
            cursor: "pointer",
            ":hover": { a: { textDecoration: "underline" } },
            alignItems: "center",
            maxWidth: "calc(100vw - 300px - 12rem)",
          }}
          onClick={openFile}
        >
          <InsertDriveFile sx={{ marginRight: ".5rem" }} />
          <div style={{ width: "calc(100% - 24px)" }}>
            <Link
              href={url}
              target="_blank"
              sx={{
                width: "100%",
                display: "block",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {label.replace(/_[a-zA-Z0-9]{10}(\..*)$/, "$1")}
            </Link>
            {forceFileDisplay && (
              <Typography
                sx={{
                  width: "100%",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  color: theme.palette.error.main,
                }}
              >
                Preview failed to load
              </Typography>
            )}
          </div>
        </Paper>
      </>
    );
  }
};

export default MessageAttachment;
