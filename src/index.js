import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

class App extends React.Component {
  state = {
    breakTime: 300,
    sessionTime: 1500,
    isTimerOn: false,
  };

  handleReset = () => {
    console.log("RESET TRIGGERED!");
    this.setState({ breakTime: 300, sessionTime: 1500, isTimerOn: false });
  };

  handleIncrement = (type) => {
    type === "session"
      ? this.setState({ sessionTime: this.state.sessionTime + 60 })
      : this.setState({ breakTime: this.state.breakTime + 60 });
  };

  handleDecrement = (type) => {
    type === "session"
      ? this.setState({ sessionTime: this.state.sessionTime - 60 })
      : this.setState({ breakTime: this.state.breakTime - 60 });
  };

  convertTime = (seconds) => {
    console.log("SECONDS INPUT:", seconds);
    let minutes = Math.floor(seconds / 60);
    let remainderSeconds = seconds % 60;
    let display = `${minutes}:${
      remainderSeconds < 10 ? "0" : ""
    }${remainderSeconds}`;
    return display;
  };

  render() {
    const { breakTime, sessionTime } = this.state;
    return (
      <div className="container-main">
        <img src="https://i0.wp.com/post.healthline.com/wp-content/uploads/2019/10/Tomato_1296x728-header-1296x728.jpg?w=1155&h=1528"></img>
        <h1 className="title">Pomodoro Clock</h1>
        <div className="container-length">
          <SetLength
            name="break"
            length={breakTime / 60}
            increment={this.handleIncrement}
            decrement={this.handleDecrement}
          />
          <Initializer onClick={this.handleReset} />
          <SetLength
            name="session"
            length={sessionTime / 60}
            increment={this.handleIncrement}
            decrement={this.handleDecrement}
          />
        </div>
        <Timer timeLeft={this.convertTime(sessionTime)} />
      </div>
    );
  }
}

class SetLength extends React.Component {
  state = {};
  render() {
    return (
      <div className="wrapper-length">
        <h2 id={`${this.props.name}-label`}>
          {this.props.name.charAt(0).toUpperCase() +
            this.props.name.slice(1) +
            " length"}
        </h2>
        <button
          id={`${this.props.name}-increment`}
          className="arrow increment"
          onClick={() => this.props.increment(this.props.name)}
        >
          ↑
        </button>
        <p id={`${this.props.name}-length`}>{this.props.length}</p>
        <button
          id={`${this.props.name}-decrement`}
          className="arrow decrement"
          onClick={() => this.props.decrement(this.props.name)}
        >
          ↓
        </button>
      </div>
    );
  }
}

class Timer extends React.Component {
  state = {};
  render() {
    return (
      <div className="container-timer">
        <h2 id="timer-label">Session</h2>
        <h1 id="time-left">{this.props.timeLeft}</h1>
        {this.props.children}
      </div>
    );
  }
}

const Initializer = (props) => {
  return (
    <div className="container-btns">
      <span id="start_stop">▶️</span>
      <span id="reset" onClick={props.onClick}>
        🔄
      </span>
    </div>
  );
};

export default Timer;

ReactDOM.render(<App />, document.getElementById("root"));
