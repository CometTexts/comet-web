"use client";

import pb from "@/pb";
import getInitials from "@/tools/getInitials";
import { Collections, Group, Handler, Message } from "@/types";
import {
  Avatar,
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
import { useCallback, useEffect, useState } from "react";

interface IProps {
  group: Group;
}

const GroupListItem: React.FC<IProps> = ({ group }) => {
  const [latestMessage, setLatestMessage] = useState<Message>();
  const [loadingLatestMessage, setLoadingLatesMessage] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();

  const handleRedirect: Handler<[string]> = (groupId) => {
    return (evt) => {
      evt.preventDefault();
      router.push(`/groups/${groupId}`);
    };
  };

  const handlePrefetch: Handler<[string]> = (groupId) => {
    return () => {
      router.prefetch(`/groups/${groupId}`);
    };
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

  useEffect(() => {
    pb.collection(Collections.Messages).subscribe<Message>(
      "*",
      async ({ action, record }: { action: string; record: Message }) => {
        if (record.group === group.id) {
          switch (action) {
            case "create": {
              if (new Date(record.created) > new Date(latestMessage?.created ?? 0)) {
                const from = await pb.collection(Collections.Users).getOne(record.from);
                const newRecord = { ...record, expand: { from } };
                setLatestMessage(newRecord);
              }
              break;
            }
            case "update": {
              if (record.id === latestMessage?.id) {
                const newRecord = { ...record, expand: { from: latestMessage?.expand?.from } };
                setLatestMessage(newRecord);
              }
              break;
            }
            case "delete": {
              fetchLatestMessage();
              break;
            }
          }
        }
      }
    );

    return () => {
      pb.collection(Collections.Messages).unsubscribe("*");
    };
  }, [latestMessage]);

  return (
    <Paper elevation={2} sx={{ padding: 0 }}>
      <ListItem disableGutters disablePadding key={group.id}>
        <ListItemButton
          selected={pathname === `/groups/${group.id}`}
          href={`/groups/${group.id}`}
          onClick={handleRedirect(group.id)}
          onMouseEnter={handlePrefetch(group.id)}
          style={{ padding: "1rem", borderRadius: theme.shape.borderRadius }}
        >
          <ListItemAvatar>
            <Avatar src={group.icon ? pb.files.getUrl(group, group.icon) : ""} alt={group.name}>
              {getInitials(group.name)}
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
        </ListItemButton>
      </ListItem>
    </Paper>
  );
};

export default GroupListItem;
