import React, { useState, useContext } from "react";
import { store } from "../store.js";
import { useHistory } from "react-router-dom";
export function Login() {
  const storeContext = useContext(store);
  const globalState = storeContext.state;
  const { dispatch } = storeContext;
  let history = useHistory();
  const [state, setState] = useState({
    username: "",
    password: ""
  });
  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value
    }));
  };
  const reqLogin = (e) => {
    e.preventDefault();
    let { username, password } = state;
    /*
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password
      })
    };
    
    fetch(server_URL + "/login", requestOptions)
    .then(async (response) => {
      const data = await response.json();
  
      // check for error response
      if (!response.ok) {
        // get error message from body or default to response status
        const error = (data && data.message) || response.status;
        return Promise.reject(error);
      }
  
      dispatch({
        type: "setAuth",
        value: true
      });
      return(
        <Redirect
          to={{
            pathname: "/home"
          }}
        />
      );
    })
    .catch((error) => {
      this.setState({ errorMessage: error.toString() });
      console.error("There was an error!", error);
    });*/
    if (username === "huajun" && password === "huajun") {
      dispatch({
        type: "setAuth",
        value: true
      });
      dispatch({
        type: "setUser",
        value: username
      });
      history.push("/home");
    } else if (username.length === 0) {
      document.getElementById("login-error").innerText =
        "Username cannot be blank";
    } else if (password.length === 0) {
      document.getElementById("login-error").innerText =
        "Password cannot be blank";
    } else {
      document.getElementById("login-error").innerText =
        "Invalid Username or Password";
    }
  };
  return (
    <div className="maincontainer h-100">
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
                  <p id="login-error" className="text-danger"></p>
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
