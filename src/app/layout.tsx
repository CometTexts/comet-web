import { ILayout } from "@/types";
import type { Metadata } from "next";
import AppBar from "@/components/AppBar";
import Container from "./container";
import ThemeRegistry from "@/components/ThemeRegistry";
import ClientRecoilRoot from "@/client-providers/RecoilRoot";
import { Typography } from "@mui/material";
import AuthManager from "./authManager";
import SnackbarProvider from "@/components/SnackBar";

export const metadata: Metadata = {
  title: "Comet",
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
                <SnackbarProvider>
                  <div style={{ height: 64 }} />
                  <noscript>
                    <Typography variant="h4" fontWeight="bold" component="p">
                      This site heavily relies on JavaScript! Please enable it for the best experience.
                    </Typography>
                  </noscript>
                  {children}
                </SnackbarProvider>
              </Container>
            </AuthManager>
          </ThemeRegistry>
        </ClientRecoilRoot>
      </body>
    </html>
  );
};

export default Layout;
