import React from "react";
import ReactDOM from "react-dom/client";
import Routes from "./Routes";
import "../src/i18n";
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    h1: {
      fontSize: "1.5rem",
      fontWeight: "400",
      textAlign: "center"
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
    <Routes />
    </ThemeProvider>
  </React.StrictMode>
);
