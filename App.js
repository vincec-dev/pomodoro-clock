import React, { Component } from 'react';
import './App.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlayCircle, faPauseCircle, faUndo, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

library.add(faPlayCircle, faPauseCircle, faUndo, faPlus, faMinus)

class App extends Component {
  state = {
    breakLength: 5, //in minutes
    sessionLength: 25, //in minutes
    secondsElapsed: 1500,
    playOn: false,
    sessionEnded: false,
    breakSeconds: 300,
    breakHasStarted: false,
    sessionText: "Session"
  }

  resetHandler() {
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      secondsElapsed: 1500,
      playOn: false,
      sessionEnded: false,
      breakSeconds: 300,
      breakHasStarted: false,
      sessionText: "Session"
    })
    clearInterval(this.interval);
  }

  breakLengthHandler(plusOrMinus) {
    const { breakLength } = this.state
    if(this.state.playOn===false) {
      if(plusOrMinus === "-" && breakLength > 1) {
        this.setState({
          breakLength: breakLength - 1,
          breakSeconds: (breakLength-1) * 60 //converts minutes to seconds
        })
      } if(plusOrMinus === "+" && breakLength < 60) {
        this.setState({
          breakLength: breakLength + 1,
          breakSeconds: (breakLength-1) * 60 //converts minutes to seconds
        })
      }
    }
  }

  sessionLengthHandler(plusOrMinus) {
    const { sessionLength } = this.state
    if(this.state.playOn===false) {
      if(plusOrMinus === "-" && sessionLength > 1) {
        this.setState({
          sessionLength: sessionLength - 1,
          secondsElapsed: (sessionLength-1) * 60 //converts minutes to seconds
        })
      } if(plusOrMinus === "+" && sessionLength < 60) {
        this.setState({
          sessionLength: sessionLength + 1,
          secondsElapsed: (sessionLength+1) * 60 //converts minutes to seconds
        })
      }
    }
  }

  getSeconds() {
    return ("0" + this.state.secondsElapsed % 60).slice(-2); //slice of -2 gives us the last 2 digets only
  }

  getMinutes() {
    return (Math.floor(this.state.secondsElapsed / 60)); //floor gives us a whole number
  }

  startBreak() {
    this.setState({
      secondsElapsed: this.state.breakSeconds, // our new secondsElapsed for our counter will equal our breakSeconds
      sessionText: "Break Session"
    })
    this.playHandler() // this starts our counter again
  }

  playHandler() {
    this.setState({playOn: true});
    clearInterval(this.interval);
      this.interval = setInterval(() => {
        if (this.state.playOn===true && this.state.secondsElapsed > 0) {
          //Just below I used the number 1 because there is a 1 seconds delay in the audio playing
          if(this.state.secondsElapsed===1) {
            this.audioBeep.play();
          }
          this.setState({secondsElapsed: this.state.secondsElapsed - 1})
        } else if (this.state.playOn===true && this.state.secondsElapsed === 0 && this.state.breakHasStarted===false) {
          clearInterval(this.interval);
          this.startBreak();
          this.setState({breakHasStarted: true})
        } else if (this.state.playOn===true && this.state.secondsElapsed === 0 && this.state.breakHasStarted===true) {
          clearInterval(this.interval);
          this.setState({
            secondsElapsed: this.state.sessionLength * 60,
            breakHasStarted: false,
            sessionText: "Session"
          })
          this.playHandler()
        }
        }, 1000);
    }

  pauseHandler() {
    this.setState({
      playOn: false,
      secondsElapsed: this.state.secondsElapsed
    })
    clearInterval(this.interval);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    var timeLeftDisplay = this.getMinutes() + ":" + this.getSeconds();

    return (
      <div className="App">
        <h1 id="page-title">Pomodoro  Clock</h1>
        <div id="timer-label">
          <h2>{this.state.sessionText}</h2>
          <div id="time-left">{timeLeftDisplay}</div>
        </div>
        <div id="start_stop_reset_btns">
          <button id="start_stop" onClick={() => this.playHandler()}><FontAwesomeIcon icon={faPlayCircle}/></button>
          <button id="start_stop_2" onClick={() => this.pauseHandler()}><FontAwesomeIcon icon={faPauseCircle}/></button>
          <button id="reset" onClick={() => this.resetHandler()}><FontAwesomeIcon icon={faUndo}/></button>
        </div>
        <div id="lengthControls">
          <div id="break-label">
            <p>Break Length</p>
            <p id="break-length">{this.state.breakLength}</p>
            <button id="break-decrement" onClick={() => this.breakLengthHandler("-")}><FontAwesomeIcon icon={faMinus}/></button>
            <button id="break-increment" onClick={() => this.breakLengthHandler("+")}><FontAwesomeIcon icon={faPlus}/></button>
          </div>
          <div id="session-label">
            <p>Session Length</p>
            <p id="session-length">{this.state.sessionLength}</p>
            <button id="session-decrement" onClick={() => this.sessionLengthHandler("-")}><FontAwesomeIcon icon={faMinus}/></button>
            <button id="session-increment" onClick={() => this.sessionLengthHandler("+")}><FontAwesomeIcon icon={faPlus}/></button>
          </div>
          <div>
            <audio id="beep" preload="auto"
            src="https://goo.gl/65cBl1"
            ref={(audio) => { this.audioBeep = audio; }} />
        </div>
        </div>
      </div>
    );
  }
}

export default App;
