import React, { Fragment, useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { ImplicitCallback, SecureRoute, withAuth } from "@okta/okta-react";
import { CssBaseline, withStyles } from "@material-ui/core";

import AppHeader from "./components/AppHeader";
import Appointments from "./pages/Appointments";
import WelcomePage from "./pages/WelcomePage";

const styles = (theme) => ({
  main: {
    padding: theme.spacing(3),
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(2),
    },
  },
});

const App = (props) => {
  const [isAuthenticated, updateIsAuthenticated] = useState(false);
  useEffect(() => {
    async function getAuthenticated() {
      const authenticated = await props.auth.isAuthenticated();
      if (authenticated != isAuthenticated) {
        updateIsAuthenticated(authenticated);
      }
    }
    getAuthenticated();
  });
  return (
    <Fragment>
      <CssBaseline />
      <AppHeader />
      <main>
        {!isAuthenticated ? <Route path="/" component={WelcomePage} /> : ""}
        <SecureRoute path="/appts" component={Appointments} />
        {isAuthenticated ? <Redirect to={{ pathname: "/appts" }} /> : ""}
        <Route path="/implicit/callback" component={ImplicitCallback} />
      </main>
    </Fragment>
  );
};

export default withStyles(styles)(withAuth(App));
