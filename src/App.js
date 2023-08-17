import React, { useEffect } from "react";
//import 'bootstrap/dist/css/bootstrap.min.css';
import "rsuite/dist/styles/rsuite-default.css";
import "react-datepicker/dist/react-datepicker.css";
import "./styles.css";
import "./assets/scrollbar.css";
import { NavBar, AlertGroup } from "./components/index.js";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Home,
  Login,
  Projects,
  EditProject,
  SpecialPlates,
  RegexPlates,
  Records,
  ParkRecords,
  ParkingRules,
  Whitelist,
  Units,
  DeviceHistory,
} from "./pages/index.js";
import { useDispatch } from "react-redux/es";
import { authActions } from "./store";
import { getUniversalCookies } from "./services/cookies";

// class DebugRouter extends Router {
//   constructor(props) {
//     super(props);
//     console.log("initial history is: ", JSON.stringify(this.history, null, 2));
//     this.history.listen((location, action) => {
//       console.log(
//         `The current URL is ${location.pathname}${location.search}${location.hash}`
//       );
//       console.log(
//         `The last navigation action was ${action}`,
//         JSON.stringify(this.history, null, 2)
//       );
//     });
//   }
// }

export function App() {
  const dispatch = useDispatch();

  const resetUser = () => {
    // const expiryDate = getUniversalCookies.get("user").expiryDate;
    getUniversalCookies().set(
      "user",
      { id: null, username: null, token: null, expiryDate: null },
      { path: "/", sameSite: "strict" }
    );
    dispatch(authActions.notAuthed());
    return;
  };

  useEffect(() => {
    const loggedInUser = getUniversalCookies().get("user");
    if (loggedInUser) {
      if (new Date() > new Date(loggedInUser.expiryDate)) {
        resetUser();
      } else {
        dispatch(authActions.authed());
      }
    }
  }, []);

  return (
    // <DebugRouter>

    <Router>
      <Switch>
        <PrivateRoute path="/home">
          <Home />
        </PrivateRoute>
        <PrivateRoute path="/project/:projectID">
          <EditProject />
        </PrivateRoute>
        <PrivateRoute path="/project">
          <Projects />
        </PrivateRoute>
        <PrivateRoute path="/specialPlates">
          <SpecialPlates />
        </PrivateRoute>
        <PrivateRoute path="/regexPlates">
          <RegexPlates />
        </PrivateRoute>
        <PrivateRoute path="/records">
          <Records />
        </PrivateRoute>
        <PrivateRoute path="/parking">
          <ParkRecords />
        </PrivateRoute>
        <PrivateRoute path="/accessRules">
          <ParkingRules />
        </PrivateRoute>
        <PrivateRoute path="/whitelist">
          <Whitelist />
        </PrivateRoute>
        <PrivateRoute path="/units">
          <Units />
        </PrivateRoute>
        <PrivateRoute path="/deviceHistory">
          <DeviceHistory />
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
  const auth = !!getUniversalCookies().get("user")?.token;
  const toggled = useSelector((state) => state.auth.toggled);
  return (
    <Route
      {...rest}
      render={(props) =>
        auth ? (
          <div className="h-100">
            <AlertGroup />
            <NavBar />
            <div
              id="content-body"
              className={
                toggled ? "content-body-collapsed" : "content-body-expand"
              }
            >
              {React.cloneElement(children, { params: props.match.params })}
            </div>
          </div>
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
}

function PublicRoute({ children, ...rest }) {
  const auth = !!getUniversalCookies().get("user")?.token;
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth ? (
          <Redirect
            to={{
              pathname: "/home",
              state: { from: location },
            }}
          />
        ) : (
          <div className="h-100">
            <AlertGroup />
            {children}
          </div>
        )
      }
    />
  );
}

export default App;
