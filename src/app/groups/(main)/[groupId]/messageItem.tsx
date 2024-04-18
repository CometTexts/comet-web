import getInitials from "@/tools/getInitials";
import { Group, Message } from "@/types";
import { MoreVert } from "@mui/icons-material";
import { Avatar, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import moment from "moment";
import { useRef, useState } from "react";
import MessageActionsMenu from "./messageActionsMenu";
import useAuthStore from "@/hooks/useAuthStore";
import pb from "@/pb";
import MomentFromNow from "@/components/MomentFromNow";
import MessageAttachment from "./messageAttachment";

interface IProps {
  message: Message;
  group: Group | undefined;
}

const MessageItem: React.FC<IProps> = ({ message, group }) => {
  const [authStore] = useAuthStore();
  const [messageActionsDialogOpen, setMessageActionsDialogOpen] = useState(false);
  const messageActionsDialogAnchor = useRef<HTMLButtonElement>(null);

  const handleOpenMessageActionsDialog = () => {
    setMessageActionsDialogOpen(true);
  };

  return (
    <>
      <Paper
        style={{
          display: "flex",
          flexDirection: "row",
          padding: "1rem",
          gap: ".5rem",
          overflowAnchor: "none",
          marginTop: ".5rem",
          marginBottom: ".5rem",
          width: "100%",
        }}
      >
        <Avatar src={pb.files.getUrl(message.expand?.from, message.expand?.from.avatar)}>
          {getInitials(message.expand?.from.name)}
        </Avatar>
        <div style={{ flexGrow: 1 }}>
          <div style={{ display: "block", flexDirection: "row", gap: 0 }}>
            <Typography fontWeight="bold" sx={{ display: "inline" }}>
              {message.expand?.from.name}
            </Typography>
            <Typography sx={{ display: "inline" }}>
              {" "}
              -{" "}
              <Tooltip title={moment(message.created).format("dddd[,] MMMM Do[,] YYYY h[:]mmA")} arrow placement="top">
                <span>
                  <MomentFromNow>{message.created}</MomentFromNow>
                </span>
              </Tooltip>
              {message.updated !== message.created ? (
                <Tooltip
                  title={moment(message.updated).format("dddd[,] MMMM Do[,] YYYY h[:]mmA")}
                  arrow
                  placement="top"
                >
                  <span>
                    {" "}
                    (edited <MomentFromNow>{message.updated}</MomentFromNow>)
                  </span>
                </Tooltip>
              ) : undefined}
            </Typography>
          </div>
          {message.text !== "$^attachment-only^$" && <Typography>{message.text}</Typography>}
          {message.attachment && message.attachmentType && (
            <MessageAttachment variant={message.attachmentType} label={message.attachment} record={message} />
          )}
        </div>
        {authStore.model?.id === message.from || authStore.model?.id === group?.owner ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <IconButton ref={messageActionsDialogAnchor} onClick={handleOpenMessageActionsDialog}>
              <MoreVert />
            </IconButton>
          </div>
        ) : (
          <></>
        )}
      </Paper>
      <MessageActionsMenu
        isOpen={messageActionsDialogOpen}
        setIsOpen={setMessageActionsDialogOpen}
        anchor={messageActionsDialogAnchor}
        message={message}
      />
    </>
  );
};

export default MessageItem;
