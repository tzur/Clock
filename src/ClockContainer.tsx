import React, { Component } from 'react';
import DialogClock from './DialogClock'
import AnalogClock from './AnalogClock'

type ClockState = {
  time: Date
}

type EmptyProps = {}

class ClockContainer extends Component<EmptyProps, ClockState> {
  constructor(props: EmptyProps) {
    super(props)
    this.state = {
      time: new Date()
    }
  }

  updateClockState() {
    this.setState({
      time: new Date()
    });
  }

  componentDidMount(){
    setInterval(() => this.updateClockState(), 1)
  }

  render() {
    return (
      <div>
        <DialogClock time={this.state.time}></DialogClock>
        <AnalogClock time={this.state.time}></AnalogClock>
      </div>
    )
  }
}

export default ClockContainer; 
export type { ClockState };

