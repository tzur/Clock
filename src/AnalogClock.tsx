import React, { useEffect, RefObject } from 'react';
import type { ClockState } from './ClockContainer'

export default function AnalogClock(props: ClockState) {
    const canvasRef: RefObject<HTMLCanvasElement> = React.createRef()
    useEffect(() => {  
        const drawClock = (clockState: ClockState) => {
            const canvas = canvasRef.current
            if (canvas === null) {
                return
            }
    
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
    
        const drawClockTimers = (context: CanvasRenderingContext2D, width: number, height: number, clockState: ClockState) => {
            const hours = clockState.time.getHours() % 12;
            const minutes = clockState.time.getMinutes() ;
            const seconds = clockState.time.getSeconds();
            const miliseconds = clockState.time.getMilliseconds()
    
            const hoursInDegrees = (hours * 30) + (0.5 * minutes)
            const minutesInDegrees = (minutes * 6) + (0.1 * seconds);
            const secondsInDegrees = seconds * 6;
            const milisecondsInDegrees = miliseconds / (1000 / 360);
    
            const hoursInRadians = degreesToRadians(hoursInDegrees)
            const minutesInRadians = degreesToRadians(minutesInDegrees)
            const secondsInRadians = degreesToRadians(secondsInDegrees)
            const milisecondsInRadians = degreesToRadians(milisecondsInDegrees)
    
            drawClockLine(context, width, height, hoursInRadians, 9)
            drawClockLine(context, width, height, minutesInRadians, 6)
            drawClockLine(context, width, height, secondsInRadians, 3)
            drawClockLine(context, width, height, milisecondsInRadians, 1)
        }
    
        const degreesToRadians = (degrees: number) => {
          return degrees * Math.PI / 180
        }
    
        const drawClockLine = (context: CanvasRenderingContext2D, clockWidth: number, clockHeight: number, lineAngle: number,
             lineWidth: number) => {
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

        drawClock(props);
    }, [canvasRef, props]);

    return(
        <div>
        <canvas ref={canvasRef} width={500} height={500} />
        </div>
    )
}
