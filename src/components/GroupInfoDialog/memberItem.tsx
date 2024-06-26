import { Group, User } from "@/types";
import { Close, Delete, Edit, EditOutlined, ModeEditOutline } from "@mui/icons-material";
import { Divider, IconButton, ListItem, ListItemSecondaryAction, ListItemText, Tooltip, useTheme } from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { stateContext } from ".";
import useAuthStore from "@/hooks/useAuthStore";

interface IProps {
  member: User;
}

const MemberItem: React.FC<IProps> = ({ member }) => {
  const state = useContext(stateContext);
  const [hovering, setHovering] = useState(false);
  const [userCanPost, setUserCanPost] = useState(state.allowedPosters.state.map((item) => item.id).includes(member.id));
  const [authStore] = useAuthStore();
  const theme = useTheme();

  useMemo(() => {
    setUserCanPost(state.allowedPosters.state.map((item) => item.id).includes(member.id));
  }, [state.allowedPosters.state]);

  const handleMouseEnter = () => {
    setHovering(true);
  };

  const handleMouseLeave = () => {
    setHovering(false);
  };

  const handleToggleAllowedPoster = () => {
    if (userCanPost) {
      const index = state.allowedPosters.state.findIndex((item) => item.id === member.id);
      const newAllowedPosters = [...state.allowedPosters.state];
      newAllowedPosters.splice(index, 1);
      state.allowedPosters.setState(newAllowedPosters);
    } else {
      state.allowedPosters.setState((allowedPosters) => [...allowedPosters, member]);
    }
  };

  return (
    <>
      <ListItem key={member.id} sx={{ paddingLeft: 0 }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Tooltip
          title={member.id === authStore.model?.id ? "Group owner can always post messages" : "Toggle Allowed Poster"}
        >
          <span>
            <IconButton
              disabled={member.id === authStore.model?.id}
              color="warning"
              size="small"
              onClick={handleToggleAllowedPoster}
              sx={{
                marginRight: ".5rem",
                ...(state.allowedPosters.state.map((item) => item.id).includes(member.id)
                  ? { opacity: 1 }
                  : { opacity: hovering ? 1 : 0, transition: theme.transitions.create("opacity") }),
              }}
            >
              {userCanPost ? <Edit /> : <EditOutlined />}
            </IconButton>
          </span>
        </Tooltip>
        <ListItemText primary={member.name} />
        <ListItemSecondaryAction>
          <Tooltip title="Remove From Group">
            <IconButton color="error">
              <Close />
            </IconButton>
          </Tooltip>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
    </>
  );
};

export default MemberItem;
