import React, { Fragment} from "react";
import { Route, Routes } from "react-router-dom";
import { CssBaseline, withStyles } from "@material-ui/core";

import Appointments from "./pages/Appointments";

const styles = (theme) => ({
  main: {
    padding: theme.spacing(3),
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(2),
    },
  },
});

const App = () => {
  return (
    <Fragment>
      <CssBaseline />
      <main>
        <Routes>
          <Route path="/" element={<Appointments/>} />
        </Routes>
      </main>
    </Fragment>
  );
};

export default withStyles(styles)(App);
