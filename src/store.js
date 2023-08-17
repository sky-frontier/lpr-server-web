import { configureStore, createSlice } from "@reduxjs/toolkit";
import React, { createContext, useReducer } from "react";

const initialState = {
  auth: false,
  user: "admin",
  toggled: false,
  jwt: "",
};
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "setAuth":
        return {
          ...state,
          auth: action.value,
        };
      case "setUser":
        return {
          ...state,
          user: action.value,
        };
      case "setToggled":
        return {
          ...state,
          toggled: !state.toggled,
        };
      case "setJwt":
        return {
          ...state,
          jwt: action.value,
        };
      default:
        throw new Error();
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

const reduxInitialState = {
  auth: false,
  user: {
    id: null,
    token: null,
    username: null,
  },
  toggled: false,
};

const userSlice = createSlice({
  name: "auth",
  initialState: reduxInitialState,
  reducers: {
    getAuth(state, action) {
      return state.auth;
    },
    notAuthed(state, action) {
      state.auth = false;
    },
    authed(state, action) {
      state.auth = true;
    },
    getUser(state, action) {
      return state.user;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    resetUser(state, action) {
      state.user = {
        id: null,
        token: null,
        username: null,
      };
    },
    getToggled(state, action) {
      return state.toggled;
    },
    setToggled(state, action) {
      state.toggled = !state.toggled;
    },
  },
});

export const reduxStore = configureStore({
  reducer: { auth: userSlice.reducer },
});
export const authActions = userSlice.actions;
export { store, StateProvider };
