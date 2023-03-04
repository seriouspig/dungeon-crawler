import { StrictMode } from "react";
import ReactDOM from "react-dom";
import Test from "./App";

import App from "./App";
import App2 from "./App2";
import App4 from "./App4";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  rootElement
);
