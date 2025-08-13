import React from "react";
import "./styles.css";
import CoolHeaderPure from "../Header/index.jsx";

/**
 * Define States, a React component of CS142 Project 4, Problem 2. The model
 * data for this view (the state names) is available at
 * window.cs142models.statesModel().
 */
class States extends React.Component {
  constructor(props) {
    super(props);
    console.log(
      "window.cs142models.statesModel()",
      window.cs142models.statesModel(),
    );
    this.state = {
      inputValue: "",
      result: window.cs142models.statesModel(),
    };
  }

  handleInput(event) {
    if (event.target.value === "") {
      this.setState({
        inputValue: event.target.value,
        result: window.cs142models.statesModel(),
      });
    } else {
      const filteredResults = window.cs142models
        .statesModel()
        .filter((item) =>
          item.toLowerCase().includes(event.target.value.toLowerCase()),
        );
      if (filteredResults.length === 0) {
        this.setState({ inputValue: event.target.value, result: undefined });
      } else {
        this.setState({
          inputValue: event.target.value,
          result: filteredResults,
        });
      }
    }
  }

  render() {
    return (
      <div>
        <CoolHeaderPure />
        <input
          className="cs142-states-input"
          type="text"
          value={this.state.inputValue}
          placeholder="输入字符串"
          onInput={(event) => this.handleInput(event)}
        ></input>
        <div className="cs142-states-display">{this.state.inputValue}</div>
        <div>
          {this.state.result === undefined ? (
            <div className="cs142-states-prompt">no match state</div>
          ) : (
            <ul className="cs142-states-result">
              {this.state.result.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }
}

export default States;
