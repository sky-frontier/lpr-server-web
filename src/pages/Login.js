import React, { useState } from "react";
import { authActions } from "../store.js";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux/es/exports.js";
import { getUniversalCookies } from "../services/cookies.js";
import { useHistory } from "react-router";

export function Login() {
  //   const storeContext = useContext(store);
  //   const globalState = storeContext.state;
  //   const { dispatch } = storeContext;
  let history = useHistory();
  const [state, setState] = useState({
    username: "",
    password: "",
  });

  const dispatch = useDispatch();

  const [errorText, setErrorText] = useState("");

  const loginServerUrl = process.env.REACT_APP_SERVER_LOGIN_URL;
  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const reqLogin = (e) => {
    e.preventDefault();
    const { username, password } = state;

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
      }),
    };

    if (username.length === 0) {
      document.getElementById("login-error").innerText =
        "Username cannot be blank";
      return;
    } else if (password.length === 0) {
      document.getElementById("login-error").innerText =
        "Password cannot be blank";
      return;
    }
    // document.getElementById("login-error").innerText =
    //   "Invalid Username or Password";
    fetch(loginServerUrl, requestOptions)
      .then(async (response) => {
        const data = await response.json();
        console.log(`Data: ${JSON.stringify(data)}`);

        // check for error response
        if (!response.ok) {
          // get error message from body or default to response status
          const error = (data && data.message) || response.status;
          if (response.status === 401) {
            document.getElementById("login-error").innerText =
              "Invalid username or password.";
          }
          return Promise.reject(error);
        }
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 1);
        getUniversalCookies().set(
          "user",
          { ...data, expiryDate },
          {
            path: "/",
            sameSite: "strict",
          }
        );

        dispatch(authActions.authed());
        history.push("/home");
        return;
      })
      .catch((error) => {
        setErrorText(error.toString());
        console.error("There was an error!", error);
      });
  };
  return (
    <div className="maincontainer h-100">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Login</title>
      </Helmet>
      <div className="container-fluid bg-light h-100">
        <div className="login d-flex align-items-center py-5">
          <div className="container">
            <div className="row">
              <div className="col-xs-10 col-sm-6 col-md-5 col-xl-4 mx-auto ">
                <h3 className="display-4">Login</h3>
                <p className="text-muted mb-4">
                  Enter your credentials to login.
                </p>
                <form>
                  <div className="form-group mb-3">
                    <input
                      id="username"
                      type="username"
                      placeholder="Username"
                      required="required"
                      className="form-control rounded-pill border-0 shadow-sm px-4"
                      onChange={handleChange}
                      value={state.username}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <input
                      id="password"
                      type="password"
                      placeholder="Password"
                      required="required"
                      className="form-control rounded-pill border-0 shadow-sm px-4 text-primary"
                      onChange={handleChange}
                      value={state.password}
                    />
                  </div>
                  <p id="login-error" className="text-danger">
                    {errorText}
                  </p>
                  <button
                    type="submit"
                    className="btn btn-primary btn-block text-uppercase mb-2 rounded-pill shadow-sm"
                    onClick={reqLogin}
                  >
                    Sign in
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default { Login };
