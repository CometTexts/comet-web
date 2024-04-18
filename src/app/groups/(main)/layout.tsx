import { ILayout } from "@/types";
import { Divider, Paper } from "@mui/material";
import GroupList from "./groupList";

const Layout: ILayout = ({ children }) => {
  return (
    <div style={{ display: "flex", height: "calc(100vh - 64px)" }}>
      <Paper
        style={{
          width: 300,
          padding: "1rem",
          height: "100%",
          overflowY: "scroll",
          borderRadius: 0,
          flexShrink: 0,
        }}
      >
        <GroupList />
      </Paper>
      <div
        style={{
          flex: 1,
          height: "100%",
          width: "calc(100vw - 300px)",
          display: "flex",
          flexDirection: "column-reverse",
          overflowAnchor: "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
