import React, { useEffect, RefObject } from 'react';
import {OffsetNeedle} from './AnalogClockContainer';
import type {point} from './AnalogClockContainer';

type AnalogClockDrawingModel = {
    hoursAngle: number,
    minutesAngle: number,
    secondsAngle: number,
    onNeedleOffsetChange: (offsetPoint: point) => void,
    needlePressed: (needle: OffsetNeedle) => void,
    needleReleased: () => void
}

export default function AnalogClock(props: AnalogClockDrawingModel) {
    const canvasRef: RefObject<HTMLCanvasElement> = React.createRef()
    type point = {
        x: number,
        y: number
    }
    type line = {
        start: point,
        end: point
    }

    useEffect(() => {  
        const canvas = canvasRef.current
        if (canvas === null) {
            return
        }
        const drawClock = (clockState: AnalogClockDrawingModel) => {
            const context = canvas.getContext("2d")
            if (context === null) {
              return
            }
    
            context.clearRect(0, 0, canvas.width, canvas.height);
            drawClockBackground(context, canvas.width, canvas.height);
            drawClockTimers(context, canvas.width, canvas.height, clockState);
        }
        
        const drawClockBackground = (context: CanvasRenderingContext2D, width: number, height: number) => {
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

        const drawClockTimers = (context: CanvasRenderingContext2D, width: number, 
            height: number, clockState: AnalogClockDrawingModel) => {            
            drawClockLine(context, clockState.hoursAngle, 9, {x: width / 2, y: height / 2})
            drawClockLine(context, clockState.minutesAngle, 6, {x: width / 2, y: height / 2})
            drawClockLine(context, clockState.secondsAngle, 3, {x: width / 2, y: height / 2})
        }
    
        const drawClockLine = (context: CanvasRenderingContext2D, lineAngle: number, lineWidth: number, startPoint: point) => {
            const line = clockLine(200, lineAngle, startPoint.x, startPoint.y)        
            context.beginPath()
            context.moveTo(line.start.x, line.start.y)
            context.lineTo(line.end.x, line.end.y)
            context.lineWidth = lineWidth
            context.stroke()
            context.closePath()
        }

        const clockLine = (lineLength: number, lineAngle: number,  startPointX: number, startPointY: number) => {
            const startPoint = {
                x: startPointX,
                y: startPointY
            }
    
            const endPoint = {
                x: startPoint.x + Math.cos(lineAngle) * 200,
                y: startPoint.y + Math.sin(lineAngle) * 200
            }
    
            return {start: startPoint, end: endPoint}
        }

        drawClock(props);
        const mouseUpEvent = (event: MouseEvent)=> {
            props.needleReleased()
        }

        const mouseMoveEvent = (event: MouseEvent)=> {
            const canvasRect = canvas.getBoundingClientRect()
            const mousePoint = {
                x: event.clientX - canvasRect.left,
                y: event.clientY - canvasRect.top
            }

            const mouseNormalizedPoint: point = {
                x: (mousePoint.x - 250) / 250,
                y: (mousePoint.y - 250) / 250
            }
            props.onNeedleOffsetChange(mouseNormalizedPoint)
        }

        const mouseDownEvent = (event: MouseEvent)=> {
            const canvasRect = canvas.getBoundingClientRect()
            const mousePoint = {
                x: event.clientX - canvasRect.left,
                y: event.clientY - canvasRect.top
            }

            const hours = clockLine(200, props.hoursAngle, canvas.width / 2, canvas.height / 2)
            const minutes = clockLine(200, props.minutesAngle, canvas.width / 2, canvas.height / 2)
            const seconds = clockLine(200, props.secondsAngle, canvas.width / 2, canvas.height / 2)

            const isHoursClicked = isClockLinePressed(hours, mousePoint)
            const isMinutesClicked = isClockLinePressed(minutes, mousePoint)
            const isSecondsClicked = isClockLinePressed(seconds, mousePoint)

            if (isHoursClicked) {
                props.needlePressed(OffsetNeedle.Hours)
                return
            } 

             if (isMinutesClicked) {
                props.needlePressed(OffsetNeedle.Minutes)
                return
             }

             if (isSecondsClicked) {
                props.needlePressed(OffsetNeedle.Seconds)
             }
        }

        const isClockLinePressed = (clockLine: line, mousePoint: point) => {
            const crossproduct =
                (mousePoint.y - clockLine.start.y) * (clockLine.end.x - clockLine.start.x) - 
                (mousePoint.x - clockLine.start.x) * (clockLine.end.y - clockLine.start.y)
            if (Math.abs(crossproduct) > 500) {
                return false
            }

            const dotproduct = (mousePoint.x - clockLine.start.x) * (clockLine.end.x - clockLine.start.x) + 
                (mousePoint.y - clockLine.start.y) * (clockLine.end.y - clockLine.start.y)
            if (dotproduct < 0) {
                return false
            }

            const swuaredLentgh = Math.pow((clockLine.end.x - clockLine.start.x), 2) + Math.pow((clockLine.end.y - clockLine.start.y), 2)
            if (dotproduct > swuaredLentgh) {
                return false
            }

            return true
        }

        canvas.addEventListener("mousedown", mouseDownEvent)
        canvas.addEventListener("mouseup", mouseUpEvent)
        canvas.addEventListener("mousemove", mouseMoveEvent)
        return (()=> {
            canvas.removeEventListener("mousedown", mouseDownEvent)
            canvas.removeEventListener("mouseup", mouseUpEvent)
            canvas.removeEventListener("mousemove", mouseMoveEvent)

        })
    }, [canvasRef, props]);

    return(
        <div>
        <canvas ref={canvasRef} width={500} height={500} />
        </div>
    )
}
