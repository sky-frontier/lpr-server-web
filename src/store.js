import React, { createContext, useReducer } from "react";

const initialState = {
  auth: true,
  user: "huajun",
  toggled: false
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
      case "setToggled":
        return {
          ...state,
          toggled: !state.toggled
        };
      default:
        throw new Error();
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
