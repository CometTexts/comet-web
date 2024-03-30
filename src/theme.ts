"use client";
import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    text: {
      primary: "#E6E1E5",
      secondary: "#CAC4D0",
      disabled: "rgba(230, 225, 229, 0.38)",
    },
    primary: {
      main: "#D0BCFF",
    },
    secondary: {
      main: "#CCC2DC",
    },
    background: {
      default: "#1C1B1F",
      paper: "#25232A",
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    text: {
      primary: "#1C1B1F",
      secondary: "#49454F",
      disabled: "rgba(28, 27, 31, 0.38)",
    },
    primary: {
      main: "#6750A4",
    },
    secondary: {
      main: "#625B71",
    },
    background: {
      default: "#FFFBFE",
      paper: "#F7F3F9",
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});
