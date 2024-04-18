"use client";

import pb from "@/pb";
import getInitials from "@/tools/getInitials";
// import { MessageEventHandler } from "@/app/pbEventInitializer";
import { Collections, Group, Handler, Message, User, WithExpand } from "@/types";
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
import { MouseEventHandler, useCallback, useContext, useEffect, useState } from "react";
import GroupListItemRightClickMenu from "./(contextMenu)/index";
import { MoreVert } from "@mui/icons-material";
import { PBEventHandler, pocketBaseHandler } from "@/messageEventHandler";
import { snackbarContext } from "@/components/SnackBar";

interface IProps {
  group: Group;
}

const GroupListItem: React.FC<IProps> = ({ group }) => {
  const [latestMessage, setLatestMessage] = useState<WithExpand<Message, { from: User }>>();
  const [loadingLatestMessage, setLoadingLatesMessage] = useState(true);
  const [contextOrigin, setContextOrigin] = useState<[number, number]>([0, 0]);
  const [contextOpen, setContextOpen] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [ignoreClick, setIgnoreClick] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const { setSnackbar } = useContext(snackbarContext);

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
        .getFirstListItem<WithExpand<Message, { from: User }>>(`group="${group.id}"`, {
          sort: "-created",
          expand: "from",
        });
      setLatestMessage(newLatestMessage);
    } catch (err) {
      console.error(err);
    }
    setLoadingLatesMessage(false);
  };

  useEffect(() => {
    fetchLatestMessage();
  }, []);

  useEffect(() => {
    const handleMessageEvent: PBEventHandler<Message> = async ({ action, record }) => {
      console.log(action, record);
      if (record.group === group.id) {
        switch (action) {
          case "create": {
            try {
              const messageUser = await pb.collection<User>(Collections.Users).getOne(record.from);
              setLatestMessage({
                ...record,
                expand: {
                  from: messageUser,
                },
              });
            } catch (err) {
              setSnackbar({
                message: "Failed to fetch user data of newly sent message!",
                isAlert: true,
                severity: "error",
              });
            }
            break;
          }
          case "update": {
            if (latestMessage) {
              setLatestMessage({
                ...record,
                expand: {
                  from: latestMessage.expand.from,
                },
              });
            } else {
              try {
                const messageUser = await pb.collection<User>(Collections.Users).getOne(record.from);
                setLatestMessage({
                  ...record,
                  expand: {
                    from: messageUser,
                  },
                });
              } catch {
                setSnackbar({
                  message: "Failed to fetch user data of recently updated message!",
                  isAlert: true,
                  severity: "error",
                });
              }
            }
            break;
          }
          case "delete": {
            fetchLatestMessage();
            break;
          }
        }
      }
    };

    pocketBaseHandler.on("messageEvent", handleMessageEvent);

    return () => {
      pocketBaseHandler.removeListener("messageEvent", handleMessageEvent);
    };
  }, [group]);

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
                  `${latestMessage.expand?.from.name.split(/[\ \_]/g)[0]}${
                    latestMessage.text === "$^attachment-only^$" ? " sent an attachment" : `: ${latestMessage.text}`
                  }`
                ) : undefined
              }
              secondaryTypographyProps={{
                sx: {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "initial",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                },
              }}
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
