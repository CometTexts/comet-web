import getInitials from "@/tools/getInitials";
import { Group, Message } from "@/types";
import { MoreVert } from "@mui/icons-material";
import { Avatar, IconButton, Paper, Typography } from "@mui/material";
import moment from "moment";
import { useRef, useState } from "react";
import MessageActionsMenu from "./messageActionsMenu";
import useAuthStore from "@/hooks/useAuthStore";
import pb from "@/pb";

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
        }}
      >
        <Avatar src={pb.files.getUrl(message.expand?.from, message.expand?.from.avatar)}>
          {getInitials(message.expand?.from.name)}
        </Avatar>
        <div style={{ flexGrow: 1 }}>
          <div style={{ display: "flex", flexDirection: "row", gap: 0 }}>
            <Typography fontWeight="bold">{message.expand?.from.name}</Typography>
            <Typography>
              &nbsp;-&nbsp;
              {moment(message.created).fromNow()}
              {message.updated !== message.created ? ` (edited ${moment(message.updated).fromNow()})` : undefined}
            </Typography>
          </div>
          <Typography>{message.text}</Typography>
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
