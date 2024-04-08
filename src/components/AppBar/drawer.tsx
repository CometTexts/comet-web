"use client";

import useAuthStore from "@/hooks/useAuthStore";
import pb from "@/pb";
import { Handler } from "@/types";
import { Group, Home, KeyboardArrowLeft, Logout, Settings } from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer as MuiDrawer,
  useTheme,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { MouseEventHandler } from "react";

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Drawer: React.FC<IProps> = ({ isOpen, setIsOpen }) => {
  const [authStore] = useAuthStore();
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const handlePrefetch: Handler<[string]> = (path) => {
    return () => {
      router.prefetch(path);
    };
  };

  const handleRedirect: Handler<[string]> = (path) => {
    return (evt) => {
      evt.preventDefault();
      router.push(path);
      setIsOpen(false);
    };
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <MuiDrawer open={isOpen} onClose={handleClose}>
      <div style={{ width: "100vw", maxWidth: 250 }}>
        <div style={{ width: "100%", height: 63, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
          <IconButton sx={{ margin: "0 24px" }} onClick={handleClose}>
            <KeyboardArrowLeft />
          </IconButton>
        </div>
        <Divider />
        <List>
          {!authStore.isAdmin && (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  selected={pathname === "/"}
                  href="/"
                  onClick={handleRedirect("/")}
                  onMouseEnter={handlePrefetch("/")}
                >
                  <ListItemIcon sx={{ color: theme.palette.text.primary }}>
                    <Home />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  selected={pathname.startsWith("/groups")}
                  href="/groups"
                  onClick={handleRedirect("/groups")}
                  onMouseEnter={handlePrefetch("/groups")}
                >
                  <ListItemIcon sx={{ color: theme.palette.text.primary }}>
                    <Group />
                  </ListItemIcon>
                  <ListItemText primary="Groups" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  selected={pathname === "/settings"}
                  href="/settings"
                  onClick={handleRedirect("/settings")}
                  onMouseEnter={handlePrefetch("/settings")}
                >
                  <ListItemIcon sx={{ color: theme.palette.text.primary }}>
                    <Settings />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItemButton>
              </ListItem>
              <Divider />
            </>
          )}
          <ListItem disablePadding>
            <ListItemButton
              href="/login"
              onClick={(evt) => {
                evt.preventDefault();
                pb.authStore.clear();
                router.push("/login");
                setIsOpen(false);
              }}
              onMouseEnter={handlePrefetch("/login")}
            >
              <ListItemIcon sx={{ color: theme.palette.text.primary }}>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </div>
    </MuiDrawer>
  );
};

export default Drawer;
