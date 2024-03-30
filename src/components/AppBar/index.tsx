"use client";

import { IconButton, AppBar as MuiAppBar, Toolbar, Typography, useTheme } from "@mui/material";
import { Menu } from "@mui/icons-material";
import DrawerHandler from "./drawerHandler";
import Link from "next/link";

const AppBar: React.FC = () => {
  return (
    <MuiAppBar>
      <Toolbar sx={{ flexDirection: "row", alignItems: "center" }}>
        <DrawerHandler />
        <Typography
          variant="h6"
          component="h1"
          sx={{
            marginLeft: "12px",
            display: "inline",
            ":hover": { textDecoration: "underline" },
            color: "#E6E1E5",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              color: "inherit",
              textDecoration: "inherit",
              overflowX: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            ChoirTexts
          </Link>
        </Typography>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
