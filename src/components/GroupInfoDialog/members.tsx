import pb from "@/pb";
import { Collections, User } from "@/types";
import { useContext, useEffect, useState } from "react";
import { stateContext } from ".";
import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import MemberItem from "./memberItem";

const GroupMembers: React.FC = () => {
  const state = useContext(stateContext);
  const theme = useTheme();
  const [members, setMembers] = useState<User[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (state.existingGroupId) {
      (async () => {
        const newMembers = await pb
          .collection(Collections.Users)
          .getFullList<User>({ filter: `joinedGroups.id ?= "${state.existingGroupId}"` });
        setMembers(newMembers);
        setLoaded(true);
      })();
    } else {
      setLoaded(true);
    }
  }, []);

  if (loaded) {
    if (members.length === 0) {
      return <p>No members</p>;
    }

    return (
      <>
        <Typography sx={{ color: theme.palette.text.secondary }}>
          {members.length} Member{members.length === 0 || members.length > 1 ? "s" : ""}
        </Typography>
        <List sx={{ overflowY: "scroll" }}>
          <Divider />
          {members.map((member) => {
            return <MemberItem member={member} />;
          })}
        </List>
      </>
    );
  }

  return <p>loading</p>;
};

export default GroupMembers;
