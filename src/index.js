import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Panel from "./pages/Panel";
import Login from "./pages/Login";
import Bot from "./pages/Bot";

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/panel" element={<Panel />} />
      <Route path="/login" element={<Login />} />
      <Route path="/bot" element={<Bot />} />
    </Routes>
  </Router>,
  document.getElementById("root")
);
