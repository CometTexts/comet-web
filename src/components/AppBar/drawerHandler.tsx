"use client";

import { Menu } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import Drawer from "./drawer";
import { useState } from "react";
import pb from "@/pb";
import useAuthStore from "@/hooks/useAuthStore";

const DrawerHandler: React.FC = () => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const [authStore] = useAuthStore();

  const handleDrawerOpen = () => {
    setDrawerIsOpen(true);
  };

  if (authStore.token) {
    return (
      <>
        <IconButton onClick={handleDrawerOpen} style={{ color: "#E6E1E5" }}>
          <Menu />
        </IconButton>
        <Drawer isOpen={drawerIsOpen} setIsOpen={setDrawerIsOpen} />
      </>
    );
  }

  return <></>;
};

export default DrawerHandler;
