import { List, ListItem, ListItemButton, Paper, Typography } from "@mui/material";
import { NextPage } from "next";

const Groups: NextPage = () => {
  return (
    <div style={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Typography variant="h5" fontWeight="bold" sx={{ textAlign: "center" }}>
        Please select a group from the left to view it's messages.
      </Typography>
    </div>
  );
};

export default Groups;
