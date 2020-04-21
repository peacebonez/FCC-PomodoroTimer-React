import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

let myTimer;

class App extends React.Component {
  state = {
    breakTime: 300,
    sessionTime: 1500,
    activeTime: 1500,
    sessionOn: false,
    breakOn: false,
  };

  handleReset = () => {
    console.log("RESET TRIGGERED!");
    this.setState(
      {
        breakTime: 300,
        sessionTime: 1500,
        activeTime: 1500,
        sessionOn: false,
        breakOn: false,
        isPaused: false,
      },
      () => clearInterval(myTimer)
    );
  };

  countDown = () => {
    const {
      breakTime,
      sessionTime,
      activeTime,
      sessionOn,
      breakOn,
    } = this.state;
    myTimer = setInterval(() => {
      if (activeTime === 0) {
        clearInterval(myTimer);
        return;
      }
      this.setState({ activeTime: this.state.activeTime - 1 });
    }, 10);
  };

  handleTimer = () => {
    const { breakTime, sessionTime, sessionOn, breakOn } = this.state;

    //starting from initial state
    if (!sessionOn && !breakOn) {
      //turn session on & set timer to active state
      this.setState({ sessionOn: true, activeTime: sessionTime });
      this.countDown();
    }

    //pause a session
    if (sessionOn) {
      this.setState({ sessionOn: false, activeTime: sessionTime });
      clearInterval(myTimer);
    }

    //pause a break
    if (breakOn) {
      this.setState({ sessionOn: false, breakOn: true, activeTime: breakTime });
      this.countDown();
    }
  };

  handleIncrementBreak = () => {
    if (this.state.breakTime >= 3600) return;
    this.setState({ breakTime: this.state.breakTime + 60 });
  };
  handleDecrementBreak = () => {
    if (this.state.breakTime < 60) return;
    this.setState({ breakTime: this.state.breakTime - 60 });
  };

  handleIncrementSession = () => {
    if (this.state.sessionTime >= 3600) return;
    this.setState({ sessionTime: this.state.sessionTime + 60 });
  };
  handleDecrementSession = () => {
    if (this.state.sessionTime < 60) return;
    this.setState({ sessionTime: this.state.sessionTime - 60 });
  };

  convertTime = (seconds) => {
    let minutes = Math.floor(seconds / 60);
    let remainderSeconds = seconds % 60;
    let display = `${minutes}:${
      remainderSeconds < 10 ? "0" : ""
    }${remainderSeconds}`;
    return display;
  };

  componentDidMount = () => {
    const { breakTime, sessionTime, sessionOn, breakOn } = this.state;
    console.log("Mounted!");
  };

  componentWillUpdate = () => {
    if (this.state.activeTime < 1) {
      clearInterval(myTimer);
      this.setState({
        sessionOn: !this.state.sessionOn,
        breakOn: !this.state.breakOn,
        activeTime: this.state.breakTime,
      });
      this.countDown();
    }
  };

  render() {
    const {
      breakTime,
      sessionTime,
      activeTime,
      breakOn,
      sessionOn,
    } = this.state;

    return (
      <div className="container-main">
        <img src="https://i0.wp.com/post.healthline.com/wp-content/uploads/2019/10/Tomato_1296x728-header-1296x728.jpg?w=1155&h=1528"></img>
        <h1 className="title">Pomodoro Clock</h1>
        <div className="container-length">
          <SetLength
            name="break"
            length={breakTime / 60}
            increment={this.handleIncrementBreak}
            decrement={this.handleDecrementBreak}
          />
          <Initializer
            reset={this.handleReset}
            timerInit={this.handleTimer}
            sessionOn={sessionOn}
          />
          <SetLength
            name="session"
            length={sessionTime / 60}
            increment={this.handleIncrementSession}
            decrement={this.handleDecrementSession}
          />
        </div>
        <Timer
          timeLeft={
            !sessionOn && !breakOn
              ? this.convertTime(sessionTime)
              : this.convertTime(activeTime)
          }
          sessionOn={sessionOn}
          breakOn={breakOn}
        />
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

const Timer = ({ sessionOn, breakOn, timeLeft, children }) => {
  return (
    <div className="container-timer">
      <h2 id="timer-label">
        {(!sessionOn && !breakOn) || (sessionOn && !breakOn)
          ? "Session"
          : "Break"}
      </h2>
      <h1 id="time-left">{timeLeft}</h1>
      {children}
    </div>
  );
};

const Initializer = (props) => {
  return (
    <div className="container-btns">
      <span id="start_stop" onClick={props.timerInit}>
        {props.sessionOn ? "⏸" : "▶️"}
      </span>
      <span id="reset" onClick={props.reset}>
        🔄
      </span>
    </div>
  );
};

export default Timer;

ReactDOM.render(<App />, document.getElementById("root"));
