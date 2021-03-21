import React, { Component } from 'react';
import type { ClockState } from './ClockContainer'

class AnalogClock extends Component<ClockState> {
    shouldComponentUpdate(nextProps: ClockState, nextState: any) {
        if (nextProps.time !== this.props.time) {
            this.drawClock(nextProps)
        }
        return false
    }

    drawClock(clockState: ClockState) {
        const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
        const context = canvas.getContext("2d")
        if (context === null) {
          return
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        this.drawClockBackground(context, canvas.width, canvas.height);
        this.drawClockTimers(context, canvas.width, canvas.height, clockState);
    }

    drawClockBackground(context: CanvasRenderingContext2D, width: number, height: number) {
        const strokeWidthPadding = 4
        const clockRadius = width / 2
        context.clearRect(0, 0, width, height)
        context.beginPath();
        context.arc(clockRadius, clockRadius, clockRadius - strokeWidthPadding, 0, 2 * Math.PI);
        context.stroke();
        context.closePath();

        /// Arbitrary values for "perfect" UI positinoing of the fixed letters:)
        const clockEdgesInset = 30
        context.font = "14px Arial";
        context.fillText("12", clockRadius - 9, clockEdgesInset);
        context.fillText("9", clockEdgesInset - 7, clockRadius + 3.5);
        context.fillText("6", clockRadius - 3.5, width - clockEdgesInset + 7);
        context.fillText("3", width - clockEdgesInset, clockRadius + 3.5);
    }

    drawClockTimers(context: CanvasRenderingContext2D, width: number, height: number, clockState: ClockState) {
        const hours = clockState.time.getHours() % 12;
        const minutes = clockState.time.getMinutes() ;
        const seconds = clockState.time.getSeconds();
        const miliseconds = clockState.time.getMilliseconds()

        const hoursInDegrees = (hours * 30) + (0.5 * minutes)
        const minutesInDegrees = (minutes * 6) + (0.1 * seconds);
        const secondsInDegrees = seconds * 6;
        const milisecondsInDegrees = miliseconds / (1000 / 360);

        const hoursInRadians = this.degreesToRadians(hoursInDegrees)
        const minutesInRadians = this.degreesToRadians(minutesInDegrees)
        const secondsInRadians = this.degreesToRadians(secondsInDegrees)
        const milisecondsInRadians = this.degreesToRadians(milisecondsInDegrees)

        this.drawClockLine(context, width, height, hoursInRadians, 9)
        this.drawClockLine(context, width, height, minutesInRadians, 6)
        this.drawClockLine(context, width, height, secondsInRadians, 3)
        this.drawClockLine(context, width, height, milisecondsInRadians, 1)

    }

    degreesToRadians(degrees: number): number {
        return degrees * Math.PI / 180
    } 

    drawClockLine(context: CanvasRenderingContext2D, clockWidth: number, clockHeight: number, lineAngle: number, lineWidth: number) {
        const startPoint = {
            x: clockWidth / 2,
            y: clockHeight / 2
        }

        context.translate(startPoint.x, startPoint.y)
        context.rotate(lineAngle);
        context.translate(-startPoint.x, -startPoint.y)
    
        context.beginPath()
        context.moveTo(startPoint.x, startPoint.y)
        context.lineTo(startPoint.x, 80)
        context.lineWidth = lineWidth
        context.stroke()
        context.closePath()
        context.setTransform(1,0,0,1,0,0);
    }

    render() {
        return(
          <div>
            <canvas id="canvas" width={500} height={500} />
          </div>
        )
      }
}

export default AnalogClock;
