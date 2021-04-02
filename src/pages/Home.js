import React, { useState, useContext } from "react";
import { store } from "../store.js";
export function Home() {
  const storeContext = useContext(store);
  const globalState = storeContext.state;
  const { dispatch } = storeContext;
  return <div>Home</div>;
}

export default { Home };
