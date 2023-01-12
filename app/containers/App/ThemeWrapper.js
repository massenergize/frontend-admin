import React from "react";
import Loading from "react-loading-bar";
import {
  createTheme,
  ThemeProvider,
} from "@mui/styles";
import "dan-styles/vendors/react-loading-bar/index.css";
import applicationTheme from "../../styles/theme/applicationTheme";
export const AppContext = React.createContext();
export default function ThemeWrapper({children, color, mode}) {

const theme = createTheme({
  palette: {
    primary: {
      light: "#757ce8",
      main: "#3f50b5",
      dark: "#002884",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000",
    },
  },
});
  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <Loading
          show={pageLoaded}
          color="rgba(255,255,255,.9)"
          showSpinner={false}
        />
        <AppContext.Provider value={this.handleChangeMode}>
          {children}
        </AppContext.Provider>
      </div>
    </ThemeProvider>
  );
}
