import React, { useState, useEffect } from "react";
import Example from "./components/Example/index.jsx";
import CoolHeaderPure from "./components/Header/index.jsx";
import States from "./components/States/index.jsx";
import ReactDOM from "react-dom";

function App() {
  const [examplePage, setExamplePage] = useState(true);

  const handleSwitch = (event) => {
    setExamplePage(!examplePage);
  };

  return (
    <div>
      <button onClick={handleSwitch}>
        Switch to {examplePage ? "States" : "Example"}
      </button>
      {examplePage ? <Example /> : <States />}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("reactapp"));
