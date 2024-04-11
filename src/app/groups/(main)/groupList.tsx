"use client";

import pb from "@/pb";
import { Collections, Group, Handler } from "@/types";
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
import { useEffect, useState } from "react";
import GroupListItem from "./groupListItem";
import JoinGroupDialog from "./joinGroupDialog";
import useAuthStore from "@/hooks/useAuthStore";

const GroupList: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [authStore] = useAuthStore();
  const [joinGroupDialogOpen, setJoinGroupDialogOpen] = useState(false);

  const loadGroups = async () => {
    const groups = await pb.collection(Collections.Groups).getFullList<Group>();
    setGroups(groups);
    setLoading(false);
  };

  const openJoinGroupDialog = () => {
    setJoinGroupDialogOpen(true);
  };

  useEffect(() => {
    loadGroups();
  }, []);

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
        <JoinGroupDialog isOpen={joinGroupDialogOpen} setIsOpen={setJoinGroupDialogOpen} loadGroups={loadGroups} />
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
              sx={{ flex: 1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            >
              Create Group
            </Button>
          )}
        </div>
      </List>
      <JoinGroupDialog isOpen={joinGroupDialogOpen} setIsOpen={setJoinGroupDialogOpen} loadGroups={loadGroups} />
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
