import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { StateProvider, reduxStore } from "./store.js";

import App from "./App";
import { Provider } from "react-redux/es/exports.js";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <Provider store={reduxStore}>
    <StateProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </StateProvider>
  </Provider>,
  rootElement
);
