"use client";

import pb from "@/pb";
import { Collections, Group, Handler, User } from "@/types";
import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import GroupListItem from "./groupListItem";
import JoinGroupDialog from "./joinGroupDialog";
import useAuthStore from "@/hooks/useAuthStore";
import GroupInfoDialog from "@/components/GroupInfoDialog";
import { PBEventHandler, pocketBaseHandler } from "@/messageEventHandler";
import { snackbarContext } from "@/components/SnackBar";

const GroupList: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [authStore] = useAuthStore();
  const [joinGroupDialogOpen, setJoinGroupDialogOpen] = useState(false);
  const [createGroupDialogOpen, setCreateGroupDialogOpen] = useState(false);
  const { setSnackbar } = useContext(snackbarContext);

  const addGroup = (group: Group) => {
    const newGroups = [...groups, group];
    newGroups.sort((a, b) => {
      if (a.name > b.name) {
        return -1;
      } else if (a.name < b.name) {
        return 1;
      } else {
        return 0;
      }
    });

    setGroups(newGroups);
  };

  const loadGroups = async () => {
    try {
      const groups = await pb.collection(Collections.Groups).getFullList<Group>();
      setGroups(groups);
      setLoading(false);
    } catch (err) {
      setSnackbar({
        message: "Failed to load groups!",
        isAlert: true,
        severity: "error",
      });
    }
  };

  const openJoinGroupDialog = () => {
    setJoinGroupDialogOpen(true);
  };

  const openCreateGroupDialog = () => {
    setCreateGroupDialogOpen(true);
  };

  useEffect(() => {
    loadGroups();
  }, []);

  useEffect(() => {
    const handleGroupEvent: PBEventHandler<Group> = async ({ action, record }) => {
      switch (action) {
        case "create": {
          addGroup(record);
          break;
        }
        case "update": {
          const newGroups = [...groups];
          setGroups(
            newGroups.map((group) => {
              if (group.id === record.id) {
                return record;
              }
              return group;
            })
          );
          break;
        }
        case "delete": {
          const index = groups.findIndex((group) => group.id === record.id);
          if (index !== undefined) {
            setGroups((groups) => {
              const newGroups = [...groups];
              newGroups.splice(index, 1);
              return newGroups;
            });
          } else {
            console.error("Received a group delete event for a group that does not exist!");
          }
        }
      }
    };

    const handleUserEvent: PBEventHandler<User> = async ({ action, record }) => {
      if (record.id === authStore.model?.id && action === "update") {
        if (record.joinedGroups.length !== groups.length) {
          await loadGroups();
        }
      }
    };

    pocketBaseHandler.on("groupEvent", handleGroupEvent);
    pocketBaseHandler.on("userEvent", handleUserEvent);

    return () => {
      pocketBaseHandler.removeListener("groupEvent", handleGroupEvent);
      pocketBaseHandler.removeListener("userEvent", handleUserEvent);
    };
  }, [groups]);

  if (loading) {
    return <Loading />;
  }

  if (groups.length === 0) {
    return (
      <>
        <Typography>No groups joined!</Typography>
        <Button variant="contained" onClick={openJoinGroupDialog}>
          Join Group
        </Button>
        <JoinGroupDialog isOpen={joinGroupDialogOpen} setIsOpen={setJoinGroupDialogOpen} addGroup={addGroup} />
      </>
    );
  }

  return (
    <>
      <List style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {groups.map((group) => {
          return <GroupListItem group={group} key={group.id} />;
        })}
        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
          <Button
            variant="contained"
            onClick={openJoinGroupDialog}
            sx={
              authStore.model?.subscriber
                ? { flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0 }
                : { flex: 1 }
            }
          >
            Join Group
          </Button>
          {authStore.model?.subscriber && (
            <Button
              variant="contained"
              color="secondary"
              onClick={openCreateGroupDialog}
              sx={{ flex: 1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            >
              Create Group
            </Button>
          )}
        </div>
      </List>
      <JoinGroupDialog isOpen={joinGroupDialogOpen} setIsOpen={setJoinGroupDialogOpen} addGroup={addGroup} />
      <GroupInfoDialog isOpen={createGroupDialogOpen} setIsOpen={setCreateGroupDialogOpen} variant="create" />
    </>
  );
};

const Loading: React.FC = () => {
  return (
    <div style={{ padding: ".5rem 0", display: "flex", flexDirection: "column", gap: "1rem" }}>
      {new Array(12).fill("").map((_, i) => {
        return <Skeleton variant="rounded" sx={{ height: 88 }} key={i} />;
      })}
    </div>
  );
};

export default GroupList;
