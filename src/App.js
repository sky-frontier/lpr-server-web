import React, { useContext } from "react";
import { store } from "./store.js";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import "./assets/scrollbar.css";
import { NavBar, AlertGroup } from "./components/index.js";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import { Home, Login, Projects, EditProject, PlateRegex } from "./pages/index.js";

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

export function App() {
  return (
    // <DebugRouter>
    <Router>
      <Switch>
        <PrivateRoute path="/home">
          <Home />
        </PrivateRoute>
        <PrivateRoute path="/project/:projectId">
          <EditProject />
        </PrivateRoute>
        <PrivateRoute path="/project">
          <Projects />
        </PrivateRoute>
        <PrivateRoute path="/regex">
          <PlateRegex />
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
      render={(props) =>
        auth ? (
          <div className="h-100">
              <AlertGroup />
            <NavBar />
            <div id="content-body">
              {React.cloneElement(children, { params: props.match.params })}
            </div>
          </div>
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location }
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
              pathname: "/project",
              state: { from: location }
            }}
          />
        ) : 
        <AlertGroup />(
          children
        )
      }
    />
  );
}

export default App;
