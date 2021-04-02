import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { StateProvider } from "./store.js";

import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StateProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </StateProvider>,
  rootElement
);
