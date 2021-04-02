import React, { useContext } from "react";
import { store } from "./store.js";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import { NavBar } from "./components/index.js";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import { Home, Login, Projects, EditProject } from "./pages/index.js";

class DebugRouter extends Router {
  constructor(props) {
    super(props);
    console.log("initial history is: ", JSON.stringify(this.history, null, 2));
    this.history.listen((location, action) => {
      console.log(
        `The current URL is ${location.pathname}${location.search}${location.hash}`
      );
      console.log(
        `The last navigation action was ${action}`,
        JSON.stringify(this.history, null, 2)
      );
    });
  }
}

export default function App() {
  return (
    // <DebugRouter>
    <Router>
      <Switch>
        <PrivateRoute path="/home">
          <Home />
        </PrivateRoute>
        <PrivateRoute
          path="/project/:id"
          component={EditProject}
        ></PrivateRoute>
        <PrivateRoute path="/project">
          <Projects />
        </PrivateRoute>
        <PublicRoute path="/">
          <Login />
        </PublicRoute>
      </Switch>
    </Router>
    // </DebugRouter>
  );
}

function PrivateRoute({ children, ...rest }) {
  const storeContext = useContext(store);
  const globalState = storeContext.state;
  let auth = globalState.auth;
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth ? (
          <div className="h-100">
            <NavBar />
            <div id="content-body">{children}</div>
          </div>
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

function PublicRoute({ children, ...rest }) {
  const storeContext = useContext(store);
  const globalState = storeContext.state;
  let auth = globalState.auth;
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth ? (
          <Redirect
            to={{
              pathname: "/project/temp",
              state: { from: location }
            }}
          />
        ) : (
          children
        )
      }
    />
  );
}
