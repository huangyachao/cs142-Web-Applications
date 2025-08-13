import ReactDOM from "react-dom";
import React, { useState } from "react";
import Example from "./components/Example/index.jsx";
import States from "./components/States/index.jsx";

function App() {
  const [examplePage, setExamplePage] = useState(true);

  const handleSwitch = () => {
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
