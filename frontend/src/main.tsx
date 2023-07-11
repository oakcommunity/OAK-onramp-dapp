import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import App2 from "./App2";

const container = document.getElementById("root");
const root = createRoot(container!);
const isAuth = localStorage.getItem("oak-crypto");

if (isAuth) {
  root.render(<App />);
}
if (!isAuth) {
  root.render(<App2 />);
}
