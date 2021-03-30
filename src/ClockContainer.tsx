import React, { Component } from 'react';
import DialogClock from './DialogClock'
import AnalogClockContainer, {OffsetNeedle} from './AnalogClockContainer'

type ClockState = {
  time: Date
}

type ClockContainerState = {
  time: Date,
  hoursOffset: number,
  minutesOffset: number,
  secondsOffset: number,
  offset: number,
  changesEndOffset: number,
  stopwatchTime: Date,
  clockPauseTime: Date,
  inOffsetMode: Boolean,
  isComputerTime: Boolean
}

type EmptyProps = {}

class ClockContainer extends Component<EmptyProps, ClockContainerState> {
  constructor(props: EmptyProps) {
    super(props)
    this.state = {
      time: new Date(),
      hoursOffset: 0,
      minutesOffset: 0,
      secondsOffset: 0,
      offset: 0,
      changesEndOffset: 0,
      stopwatchTime: new Date(),
      clockPauseTime: new Date(),
      inOffsetMode: false,
      isComputerTime: true
    }
  }

  componentDidMount(){
    this.updateClockState()
  }

  offsetChangesStart() {
    this.setState({
      inOffsetMode: true,
      stopwatchTime: this.currentTime(),
      clockPauseTime: new Date()
    })
  }

  onOffsetChange(offset: number, needle: OffsetNeedle) {
    switch(needle) {
      case OffsetNeedle.Hours:
        this.setState({
          hoursOffset: offset
        })
        return
      case OffsetNeedle.Minutes:
        console.log(offset)
        this.setState({
          minutesOffset: offset
        })
        return
      case OffsetNeedle.Seconds:
        this.setState({
          secondsOffset: offset
        })
    }
  }

  offsetChangesEnd() {
    const timeStopDelta =  this.state.clockPauseTime.getTime() - new Date().getTime()
    this.setState({
      changesEndOffset: this.state.changesEndOffset + timeStopDelta,
      inOffsetMode: false,
    })
  }

  currentTime() {
    return new Date(new Date().getTime() + this.state.changesEndOffset)
  }

  private updateClockState() {
    const time = this.state.inOffsetMode ? this.state.stopwatchTime : this.currentTime()
    if (this.state.isComputerTime) {
      this.setState({
        time: time,
      }, () => requestAnimationFrame(this.updateClockState.bind(this)));
  
    } else {
      this.fetchDateFromServer().then(result => {
        if (result === undefined) {
          return
        }
        this.setState({
          time: result
        }, () => requestAnimationFrame(this.updateClockState.bind(this)))
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
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText)
        }
        return response
      })
      .then(response => response.json())
      .then(data => new Date(data))
      .catch((error) => {
        console.log(error)
      }) as Promise<Date>;
  }

  handleWorldTimeClick() {
    this.setState({
      isComputerTime: false
    })  
  }

  dialogClockTime() {
    return new Date(this.state.time.getTime() + this.state.hoursOffset + this.state.minutesOffset + this.state.secondsOffset)
  }

  analogClockContainerState() {
    return {
      time: this.state.time,
      hoursOffset: this.state.hoursOffset,
      minutesOffset: this.state.minutesOffset,
      secondsOffset: this.state.secondsOffset
    }
  }

  render() {
    return (
      <div>
        <DialogClock time={this.dialogClockTime()}></DialogClock>
        <AnalogClockContainer {...this.analogClockContainerState()}
          offsetChangeStart={this.offsetChangesStart.bind(this)}
          offsetChange={this.onOffsetChange.bind(this)} 
          offsetChangesEnd={this.offsetChangesEnd.bind(this)} ></AnalogClockContainer>
        <button onClick={this.handleComputerTimeClick.bind(this)}>Computer Time</button>
        <button onClick={this.handleWorldTimeClick.bind(this)}>World Time</button>
      </div>
    )
  }
}

export default ClockContainer; 
export type { ClockState };

