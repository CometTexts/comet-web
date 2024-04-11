import pb from "@/pb";
import { Collections, Group, User, WithExpand } from "@/types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  Paper,
  useTheme,
} from "@mui/material";
import { RefObject, createContext, useEffect, useRef, useState } from "react";
import GroupInfo from "./info";
import GroupMembers from "./members";
import useAuthStore from "@/hooks/useAuthStore";

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  variant: "create" | "update";
  existingGroupId?: string;
}

type Page = "info" | "posters" | "members";

interface State {
  existingGroupId?: string;
  page: {
    state: Page;
    setState: React.Dispatch<React.SetStateAction<Page>>;
  };
  groupName: {
    state: string;
    setState: React.Dispatch<React.SetStateAction<string>>;
  };
  joinCode: {
    state: string;
    setState: React.Dispatch<React.SetStateAction<string>>;
  };
  allowedPosters: {
    state: User[];
    setState: React.Dispatch<React.SetStateAction<User[]>>;
  };
  iconInputRef: RefObject<HTMLInputElement>;
  iconUrl: {
    state: string | undefined;
    setState: React.Dispatch<React.SetStateAction<string | undefined>>;
  };
}

export const stateContext = createContext<State>({
  existingGroupId: undefined,
  page: {
    state: "info",
    setState: () => {},
  },
  groupName: {
    state: "",
    setState: () => {},
  },
  joinCode: {
    state: "",
    setState: () => {},
  },
  allowedPosters: {
    state: [],
    setState: () => {},
  },
  iconInputRef: { current: null },
  iconUrl: {
    state: undefined,
    setState: () => {},
  },
});

const GroupInfoDialog: React.FC<IProps> = ({ isOpen, setIsOpen, variant, existingGroupId }) => {
  const [page, setPage] = useState<Page>("info");
  const [groupName, setGroupName] = useState<string>("");
  const [joinCode, setJoinCode] = useState<string>("");
  const [allowedPosters, setAllowedPosters] = useState<User[]>([]);
  const iconInputRef = useRef<HTMLInputElement>(null);
  const [iconUrl, setIconUrl] = useState<string>();
  const theme = useTheme();
  const [authStore] = useAuthStore();

  const handleClose = () => {
    setIsOpen(false);
    setPage("info");
    setGroupName("");
    setJoinCode("");
    setAllowedPosters([]);
    if (iconInputRef.current) {
      iconInputRef.current.value = "";
    }
    setIconUrl(undefined);
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("name", groupName);
    formData.append("joinCode", joinCode);
    formData.append("owner", authStore.model?.id);
    formData.append("allowedPosters", allowedPosters.map((user) => user.id).join(","));
    if (iconInputRef.current?.files?.[0]) {
      formData.append("icon", iconInputRef.current.files[0]);
    }

    if (existingGroupId) {
      await pb.collection(Collections.Groups).update(existingGroupId, formData);
    } else {
      await pb.collection(Collections.Groups).create(formData);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen === true) {
      if (existingGroupId) {
        (async () => {
          const group = await pb
            .collection(Collections.Groups)
            .getOne<WithExpand<Group, { allowedPosters: User[] }>>(existingGroupId, { expand: "allowedPosters" });

          setGroupName(group.name);
          setJoinCode(group.joinCode);
          setAllowedPosters(group.expand.allowedPosters);
          if (group.icon) {
            setIconUrl(pb.files.getUrl(group, group.icon));
          }
        })();
      }
    }
  }, [isOpen]);

  const setSelectedPage = (page: Page) => {
    return () => {
      setPage(page);
    };
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth PaperProps={{ sx: { maxHeight: "90vh" } }}>
      <DialogTitle>
        {variant === "create" ? "Create Group" : groupName ? `Edit ${groupName}` : "Edit Group"}
      </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
        <Paper sx={{ width: "fit-content" }}>
          <List disablePadding>
            <ListItem disableGutters disablePadding>
              <ListItemButton
                selected={page === "info"}
                onClick={setSelectedPage("info")}
                sx={{ borderTopLeftRadius: theme.shape.borderRadius, borderTopRightRadius: theme.shape.borderRadius }}
              >
                <ListItemText sx={{ whiteSpace: "nowrap" }} primary="Group Info" />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem disableGutters disablePadding>
              <ListItemButton
                selected={page === "members"}
                onClick={setSelectedPage("members")}
                sx={{
                  borderBottomLeftRadius: theme.shape.borderRadius,
                  borderBottomRightRadius: theme.shape.borderRadius,
                }}
              >
                <ListItemText primary="Members" />
              </ListItemButton>
            </ListItem>
          </List>
        </Paper>
        {/* <Divider orientation="vertical" sx={{ height: "100px" }} /> */}
        <div
          style={{
            flexGrow: 1,
          }}
        >
          <stateContext.Provider
            value={{
              existingGroupId,
              page: {
                state: page,
                setState: setPage,
              },
              groupName: {
                state: groupName,
                setState: setGroupName,
              },
              joinCode: {
                state: joinCode,
                setState: setJoinCode,
              },
              allowedPosters: {
                state: allowedPosters,
                setState: setAllowedPosters,
              },
              iconInputRef,
              iconUrl: {
                state: iconUrl,
                setState: setIconUrl,
              },
            }}
          >
            {page === "info" && <GroupInfo />}
            {page === "members" && <GroupMembers />}
          </stateContext.Provider>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GroupInfoDialog;
