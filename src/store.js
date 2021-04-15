import React, { createContext, useReducer } from "react";

const initialState = {
  auth: true,
  user: "",
  server_URL: "http://34.87.50.188:8000/api/router"
};
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "setAuth":
        return {
          ...state,
          auth: action.value
        };
      case "setUser":
        return {
          ...state,
          user: action.value
        };
      default:
        throw new Error();
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
