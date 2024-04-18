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
import { RefObject, createContext, useContext, useEffect, useRef, useState } from "react";
import GroupInfo from "./info";
import GroupMembers from "./members";
import useAuthStore from "@/hooks/useAuthStore";
import { useRouter } from "next/navigation";
import { snackbarContext } from "../SnackBar";

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

export const generateJoinCode = () => {
  return [...Array(8)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
};

const GroupInfoDialog: React.FC<IProps> = ({ isOpen, setIsOpen, variant, existingGroupId }) => {
  const [page, setPage] = useState<Page>("info");
  const [groupName, setGroupName] = useState<string>("");
  const [joinCode, setJoinCode] = useState<string>("");
  const [allowedPosters, setAllowedPosters] = useState<User[]>([]);
  const iconInputRef = useRef<HTMLInputElement>(null);
  const [iconUrl, setIconUrl] = useState<string>();
  const theme = useTheme();
  const [authStore] = useAuthStore();
  const router = useRouter();
  const { setSnackbar } = useContext(snackbarContext);

  if (variant === "update" && existingGroupId === undefined) {
    throw "existingGroupId is required if variant is update!";
  }

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
    for (let i = 0; i < allowedPosters.length; i++) {
      formData.append("allowedPosters", allowedPosters[i].id);
    }
    console.log(iconUrl);
    if (iconInputRef.current?.files?.[0]) {
      formData.append("icon", iconInputRef.current.files[0]);
    } else {
      if (iconUrl === undefined) {
        formData.append("icon", "");
      }
    }

    if (variant === "update") {
      try {
        await pb.collection(Collections.Groups).update(existingGroupId!, formData);
      } catch {
        setSnackbar({
          message: "Failed to update group!",
          isAlert: true,
          severity: "error",
        });
      }
    } else {
      try {
        const group = await pb.collection(Collections.Groups).create<Group>(formData);
        //Join group
        try {
          await pb.collection(Collections.Users).update(authStore.model?.id, {
            joinedGroups: [...authStore.model?.joinedGroups, group.id],
          });
        } catch (err) {
          setSnackbar({
            message: "Failed to join group! Please try manually joining with the join code!",
            isAlert: true,
            severity: "error",
          });
        }
      } catch {
        setSnackbar({
          message: "Failed to create group!",
          isAlert: true,
          severity: "error",
        });
      }
    }
    handleClose();
  };

  useEffect(() => {
    if (isOpen === true) {
      if (variant === "update") {
        (async () => {
          const group = await pb
            .collection(Collections.Groups)
            .getOne<WithExpand<Group, { allowedPosters: User[] }>>(existingGroupId!, { expand: "allowedPosters" });

          setGroupName(group.name);
          setJoinCode(group.joinCode);
          setAllowedPosters(group.expand.allowedPosters);
          if (group.icon) {
            setIconUrl(pb.files.getUrl(group, group.icon));
          }
        })();
      } else {
        setJoinCode(generateJoinCode());
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
        {variant === "update" && (
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
        )}
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
