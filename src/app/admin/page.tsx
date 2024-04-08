import { Typography } from "@mui/material";
import { NextPage } from "next";
import MassNotification from "./massNotification";

const Admin: NextPage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "calc(100vh - 64px)",
      }}
    >
      <Typography variant="h4" component="h3" sx={{ marginBottom: "1rem" }}>
        Mass Notification
      </Typography>
      <MassNotification />
    </div>
  );
};

export default Admin;
