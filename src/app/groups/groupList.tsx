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

const GroupList: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  const loadGroups = async () => {
    const groups = await pb.collection(Collections.Groups).getFullList<Group>();
    setGroups(groups);
    setLoading(false);
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
        <Button variant="contained">Join Group</Button>
      </>
    );
  }

  return (
    <List style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {groups.map((group) => {
        return <GroupListItem group={group} key={group.id} />;
      })}
    </List>
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
