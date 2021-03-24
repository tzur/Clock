import React, { Component } from 'react';
import DialogClock from './DialogClock'
import AnalogClock from './AnalogClock'

type ClockState = {
  time: Date
}

type ClockContainerState = {
  time: Date,
  isComputerTime: Boolean
}

type EmptyProps = {}

class ClockContainer extends Component<EmptyProps, ClockContainerState> {
  constructor(props: EmptyProps) {
    super(props)
    this.state = {
      time: new Date(),
      isComputerTime: true
    }
  }

  componentDidMount(){
    this.updateClockState()
  }

  private updateClockState() {
    if (this.state.isComputerTime) {
      this.setState({
        time: new Date(),
      });
      requestAnimationFrame(this.updateClockState.bind(this))

    } else {
      this.fetchDateFromServer().then(result => {
          this.setState({
            time: result
          })
          requestAnimationFrame(this.updateClockState.bind(this))
      })
    }
  }

  handleComputerTimeClick() {
    this.setState({
      isComputerTime: true
    }, () => {
      this.updateClockState()
    })
  }

  fetchDateFromServer() {
    return fetch("http://localhost:8000/clock")
      .then(response => response.json())
      .then(data => new Date(data)) as Promise<Date>;
  }

  handleWorldTimeClick() {
    this.setState({
      isComputerTime: false
    })  
  }

  render() {
    return (
      <div>
        <DialogClock time={this.state.time}></DialogClock>
        <AnalogClock time={this.state.time}></AnalogClock>
        <button onClick={this.handleComputerTimeClick.bind(this)}>Computer Time</button>
        <button onClick={this.handleWorldTimeClick.bind(this)}>World Time</button>
      </div>
    )
  }
}

export default ClockContainer; 
export type { ClockState };

