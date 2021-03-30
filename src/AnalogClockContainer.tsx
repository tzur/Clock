import React from 'react';
import AnalogClock from './AnalogClock'

type AnalogContainerState = {
    currentManualControlNeedle: OffsetNeedle | null
}

export enum OffsetNeedle {
    Hours,
    Minutes,
    Seconds
}

type AnalogClockContainerProps = {
    time: Date,
    hoursOffset: number,
    minutesOffset: number,
    secondsOffset: number,
    offsetChangeStart: () => void,
    offsetChange: (offset: number, needle: OffsetNeedle) => void,
    offsetChangesEnd: () => void
}

type point = {
    x: number,
    y: number
}
class AnalogClockContainer extends React.Component<AnalogClockContainerProps, AnalogContainerState> {
    constructor(props: AnalogClockContainerProps) {
        super(props)
        this.state = {
          currentManualControlNeedle: null
        }
    }

    needlePressed(needle: OffsetNeedle) {
        if (this.state.currentManualControlNeedle !== null) {
           return
        }

        this.setState({
            currentManualControlNeedle: needle
        }, () => this.props.offsetChangeStart())
    }

    needleReleased() {
        if (this.state.currentManualControlNeedle === null) {
            return
        }
        this.setState({
            currentManualControlNeedle: null,
        }, () => this.props.offsetChangesEnd())
    }

    onNeedleOffsetChange(offsetPoint: point) {
        if (this.state.currentManualControlNeedle !== null) {
            const offset = this.offsetForPoint(offsetPoint, this.state.currentManualControlNeedle)
            this.props.offsetChange(offset, this.state.currentManualControlNeedle)
        }
    }

    offsetForPoint(mousePoint: point, needle: OffsetNeedle) {
        const offsetAngle = this.calculateOffsetAngle(mousePoint, needle)
        switch (needle) {
            case OffsetNeedle.Hours:
                const angleDegrees = offsetAngle * (180 / Math.PI)
                const seconds = (angleDegrees / 30) * 3600
                return -seconds * 1000
            case OffsetNeedle.Minutes:
                const minutesDegrees = offsetAngle * (180 / Math.PI)
                var minutesInSeconds = (minutesDegrees / 6) * 60
                return -minutesInSeconds * 1000
            case OffsetNeedle.Seconds:
                const secondsDegrees = offsetAngle * (180 / Math.PI)
                const secondsFromAngle = (secondsDegrees / 6)
                return -secondsFromAngle * 1000
        }
    }

    calculateOffsetAngle(mousePoint: point, needle: OffsetNeedle) {
        const needleAngle = this.needleAngleForNeedle(needle)
        const minutes = {
            x: Math.cos(needleAngle),
            y: Math.sin(needleAngle)
        }
        const needleSlope = (minutes.y) / (minutes.x)
        const mouseSlope = (mousePoint.y) / (mousePoint.x)

        const otherSlope = -1 / needleSlope
        var arctanOffset = 0
        if (minutes.y + needleSlope*minutes.x > 0) {
            if (mousePoint.y < otherSlope*mousePoint.x) {
                arctanOffset = Math.PI
            }
        } else {
            if (mousePoint.y > otherSlope*mousePoint.x) {
                arctanOffset = Math.PI
            }
        }
        return Math.atan((needleSlope - mouseSlope) / (1 + needleSlope*mouseSlope)) + arctanOffset
    }

    needleAngleForNeedle(needle: OffsetNeedle) {
        const lineModels = this.clockLinesModel(true)
        switch (needle) {
            case OffsetNeedle.Hours:
                return lineModels.hours
            case OffsetNeedle.Minutes:
                return lineModels.minutes
            case OffsetNeedle.Seconds:
                return lineModels.seconds
        }
    }

    offsetTime(ignoredNeedle: OffsetNeedle | null) {
        switch (ignoredNeedle) {
            case null:
                return this.props.hoursOffset + this.props.minutesOffset + this.props.secondsOffset
            case OffsetNeedle.Hours: 
                return this.props.minutesOffset + this.props.secondsOffset
            case OffsetNeedle.Minutes:
                return this.props.hoursOffset + this.props.secondsOffset
            case OffsetNeedle.Seconds:
                return this.props.hoursOffset + this.props.minutesOffset
        }
    }

    clockLinesModel(ignoreMovingNeedleOffset: Boolean) {
        const offset = ignoreMovingNeedleOffset ? this.offsetTime(this.state.currentManualControlNeedle) : this.offsetTime(null)
        const updatedTime = new Date(this.props.time.getTime() + offset)
        const hours = updatedTime.getHours() % 12;
        const minutes = updatedTime.getMinutes() ;
        const seconds = updatedTime.getSeconds();

        const hoursInDegrees = (hours * 30) + (0.5 * minutes)
        const minutesInDegrees = (minutes * 6) + (0.1 * seconds);
        const secondsInDegrees = seconds * 6;

        var hoursInRadians = this.degreesToRadians(hoursInDegrees) - (Math.PI / 2)
        const minutesInRadians = this.degreesToRadians(minutesInDegrees) - (Math.PI / 2)
        const secondsInRadians = this.degreesToRadians(secondsInDegrees) - (Math.PI / 2)

        return {
            hours: hoursInRadians,
            minutes: minutesInRadians,
            seconds: secondsInRadians
        }
    }

    degreesToRadians(degrees: number) {
        return degrees * Math.PI / 180
      }
    
    anglesDrawingModelFromState() {
        const linesModel = this.clockLinesModel(false)
        return {
            hoursAngle: linesModel.hours,
            minutesAngle: linesModel.minutes,
            secondsAngle: linesModel.seconds,
        }
    }

    render() {
        return (
            <div>
            <AnalogClock 
                {...this.anglesDrawingModelFromState()}
                onNeedleOffsetChange={this.onNeedleOffsetChange.bind(this)}
                needlePressed={this.needlePressed.bind(this)}
                needleReleased={this.needleReleased.bind(this)}></AnalogClock>
            </div>
        )
    }
}

export type {point}
export default AnalogClockContainer