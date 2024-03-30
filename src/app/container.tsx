"use client";

import { useTheme } from "@mui/material";

const Container: React.FC<React.PropsWithChildren> = ({ children }) => {
  const theme = useTheme();

  return (
    <div
      id="root"
      style={{
        backgroundColor: theme.palette.background.default,
        width: "100vw",
        height: "100vh",
        overflowY: "scroll",
      }}
    >
      {children}
    </div>
  );
};

export default Container;
