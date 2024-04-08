import pb from "@/pb";
import { Collections, User } from "@/types";
import { useContext, useEffect, useState } from "react";
import { stateContext } from ".";
import { List, ListItem, ListItemText } from "@mui/material";

const GroupMembers: React.FC = () => {
  const state = useContext(stateContext);
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
      <List>
        {members.map((member) => {
          return (
            <ListItem key={member.id}>
              <ListItemText primary={member.name} />
            </ListItem>
          );
        })}
      </List>
    );
  }

  return <p>loading</p>;
};

export default GroupMembers;
