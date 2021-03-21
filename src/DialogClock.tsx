import React from 'react';
import type { ClockState } from './ClockContainer'

const DialogClock = (clockState: ClockState) => <div>{clockState.time.toTimeString()}</div>;


export default DialogClock;
