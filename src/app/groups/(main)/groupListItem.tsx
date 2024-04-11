"use client";

import pb from "@/pb";
import getInitials from "@/tools/getInitials";
// import { MessageEventHandler } from "@/app/pbEventInitializer";
import { Collections, Group, Handler, Message } from "@/types";
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Skeleton,
  Typography,
  useTheme,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { RecordSubscription } from "pocketbase";
import { MouseEventHandler, useCallback, useEffect, useState } from "react";
import GroupListItemRightClickMenu from "./(contextMenu)/index";
import { MoreVert } from "@mui/icons-material";

interface IProps {
  group: Group;
}

const GroupListItem: React.FC<IProps> = ({ group }) => {
  const [latestMessage, setLatestMessage] = useState<Message>();
  const [loadingLatestMessage, setLoadingLatesMessage] = useState(true);
  const [contextOrigin, setContextOrigin] = useState<[number, number]>([0, 0]);
  const [contextOpen, setContextOpen] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [ignoreClick, setIgnoreClick] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();

  const handleClick: MouseEventHandler<HTMLAnchorElement> = (evt) => {
    evt.preventDefault();
    if (!ignoreClick) {
      router.push(`/groups/${group.id}`);
    }
  };

  const handlePrefetch: MouseEventHandler<HTMLAnchorElement> = () => {
    router.prefetch(`/groups/${group.id}`);
  };

  const handleRightClick: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement> = (evt) => {
    evt.preventDefault();
    setContextOrigin([evt.clientX, evt.clientY]);
    setContextOpen(true);
  };

  const handleMouseEnter: MouseEventHandler<HTMLAnchorElement> = (evt) => {
    handlePrefetch(evt);
    setHovering(true);
  };

  const handleMouseLeave: MouseEventHandler<HTMLAnchorElement> = () => {
    setHovering(false);
  };

  const fetchLatestMessage = async () => {
    setLatestMessage(undefined);
    setLoadingLatesMessage(true);
    try {
      const newLatestMessage = await pb
        .collection(Collections.Messages)
        .getFirstListItem<Message>(`group="${group.id}"`, { sort: "-created", expand: "from" });
      setLatestMessage(newLatestMessage);
    } catch (err) {
      console.error(err);
    }
    setLoadingLatesMessage(false);
  };

  useEffect(() => {
    fetchLatestMessage();
  }, []);

  // const handleMessageEvent: MessageEventHandler = async ({ action, record }) => {
  //   if (record.group === group.id) {
  //     switch (action) {
  //       case "create": {
  //         if (new Date(record.created) > new Date(latestMessage?.created ?? 0)) {
  //           const from = await pb.collection(Collections.Users).getOne(record.from);
  //           const newRecord = { ...record, expand: { from } };
  //           setLatestMessage(newRecord);
  //         }
  //         break;
  //       }
  //       case "update": {
  //         if (record.id === latestMessage?.id) {
  //           const newRecord = { ...record, expand: { from: latestMessage?.expand?.from } };
  //           setLatestMessage(newRecord);
  //         }
  //         break;
  //       }
  //       case "delete": {
  //         fetchLatestMessage();
  //         break;
  //       }
  //     }
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener("pbMessage", handleMessageEvent as any);

  //   return () => {
  //     document.removeEventListener("pbMessage", handleMessageEvent as any);
  //   };
  // }, [latestMessage]);

  return (
    <>
      <Paper elevation={2} sx={{ padding: 0 }}>
        <ListItem disableGutters disablePadding key={group.id}>
          <ListItemButton
            selected={pathname === `/groups/${group.id}`}
            href={`/groups/${group.id}`}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onContextMenu={handleRightClick}
            style={{ padding: "1rem", borderRadius: theme.shape.borderRadius }}
          >
            <ListItemAvatar>
              <Avatar src={group.icon ? pb.files.getUrl(group, group.icon) : ""} alt={group.name}>
                {getInitials(group.name, 2)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primaryTypographyProps={{ style: { fontWeight: "bold" } }}
              primary={group.name}
              secondary={
                loadingLatestMessage ? (
                  <Skeleton variant="text">
                    <Typography>Everly: Message</Typography>
                  </Skeleton>
                ) : latestMessage ? (
                  `${latestMessage.expand?.from.name}: ${latestMessage.text}`
                ) : undefined
              }
            />
            <IconButton
              onClick={handleRightClick}
              onMouseEnter={() => {
                setIgnoreClick(true);
              }}
              onMouseLeave={() => {
                setIgnoreClick(false);
              }}
              sx={{
                opacity: hovering ? 1 : 0,
                pointerEvents: hovering ? "initial" : "none",
                transition: theme.transitions.create("opacity"),
              }}
            >
              <MoreVert />
            </IconButton>
          </ListItemButton>
        </ListItem>
      </Paper>
      <GroupListItemRightClickMenu
        isOpen={contextOpen}
        setIsOpen={setContextOpen}
        position={contextOrigin}
        group={group}
      />
    </>
  );
};

export default GroupListItem;
