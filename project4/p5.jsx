import ReactDOM from "react-dom";
import { HashRouter, Route, Link } from "react-router-dom";
import React from "react";
import Example from "./components/Example/index.jsx";
import CoolHeaderPure from "./components/Header/index.jsx";
import States from "./components/States/index.jsx";

function App() {
  const navBarStyle = {
    backgroundColor: "#282c34",
    padding: "10px",
  };

  const linkStyle = {
    color: "white",
    marginRight: "20px",
    textDecoration: "none",
    fontWeight: "bold",
    padding: "6px 12px",
    borderRadius: "6px",
    transition: "background-color 0.3s ease",
  };
  return (
    <div>
      <CoolHeaderPure />
      <HashRouter>
        <nav style={navBarStyle}>
          <Link to="/example" style={linkStyle}>
            Example
          </Link>
          <Link to="/states" style={linkStyle}>
            States
          </Link>
        </nav>
        <Route path="/states" component={States} />
        <Route path="/example" component={Example} />
      </HashRouter>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("reactapp"));
