import { ILayout } from "@/types";
import type { Metadata } from "next";
import AppBar from "@/components/AppBar";
import Container from "./container";
import ThemeRegistry from "@/components/ThemeRegistry";
import ClientRecoilRoot from "@/client-providers/RecoilRoot";
import { Typography } from "@mui/material";
import AuthManager from "./authManager";

export const metadata: Metadata = {
  title: "ChoirTexts",
};

const Layout: ILayout = ({ children }) => {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <ClientRecoilRoot>
          <ThemeRegistry>
            <AuthManager>
              <Container>
                <AppBar />
                <div style={{ height: 64 }} />
                <noscript>
                  <Typography variant="h4" fontWeight="bold" component="p">
                    This site heavily relies on JavaScript! Please enable it for the best experience.
                  </Typography>
                </noscript>
                {children}
              </Container>
            </AuthManager>
          </ThemeRegistry>
        </ClientRecoilRoot>
      </body>
    </html>
  );
};

export default Layout;
