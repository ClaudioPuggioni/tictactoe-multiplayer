import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import Game from "./components/Game.jsx";
import { Provider } from "react-redux";
import store from "./store";

let reactRoot = ReactDOM.createRoot(document.getElementById("root"));

reactRoot.render(
  <Provider store={store}>
    <Game />
  </Provider>
);
