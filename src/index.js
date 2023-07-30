import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import Game from "./components/Game.jsx";
import { Provider } from "react-redux";
import store from "./store";
import { io } from "socket.io-client";

const socket = io.connect("http://localhost:3001");
// const socket = io.connect("https://tictactoe.up.railway.app/");

let reactRoot = ReactDOM.createRoot(document.getElementById("root"));

reactRoot.render(
  <Provider store={store}>
    <Game />
  </Provider>
);

export default socket;
