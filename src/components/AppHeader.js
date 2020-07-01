import React from "react";
import { AppBar, Toolbar, Typography, withStyles } from "@material-ui/core";
import LoginButton from "./LoginButton";
const styles = {
  flex: {
    flex: 1,
  },
};
const AppHeader = () => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" color="inherit">
        Brightfox
      </Typography>
      <div style={{ flex: 1 }}></div>
      <LoginButton />
    </Toolbar>
  </AppBar>
);

export default withStyles(styles)(AppHeader);
