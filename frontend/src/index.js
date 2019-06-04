import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);

serviceWorker.unregister();

// This is the logic that makes your React App to be rendered.
// document.getElementById('root') defines whcih HTML element
// Reach must render the App. 'root' element found in ./public/index.html
