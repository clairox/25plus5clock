import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import beep from './assets/beep.mp3';

function App() {
	const [breakLength, setBreakLength] = useState(5);
	const [sessionLength, setSessionLength] = useState(25);
	const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
	const [isTimerRunning, setIsTimerRunning] = useState(false);
	const [isOnBreak, setIsOnBreak] = useState(false);

	const beepEl: MutableRefObject<HTMLAudioElement | null> = useRef(null);

	const formatTime = (t: number) => {
		let minutes = ('00' + Math.trunc(t / 60)).slice(-2);
		let seconds = ('00' + (t % 60)).slice(-2);
		return minutes + ':' + seconds;
	};

	let timerID: MutableRefObject<string | number | NodeJS.Timer | undefined> = useRef(undefined);

	const startSession = useCallback(() => {
		setIsOnBreak(false);
		setTimeLeft(sessionLength * 60);
	}, [sessionLength]);

	const startBreak = useCallback(() => {
		setIsOnBreak(true);
		setTimeLeft(breakLength * 60);
	}, [breakLength]);

	useEffect(() => {
		if (isTimerRunning) {
			clearInterval(timerID.current);
			timerID.current = setInterval(() => {
				if (timeLeft !== 0) {
					setTimeLeft(timeLeft - 1);
				} else {
					beepEl.current?.play();
					isOnBreak ? startSession() : startBreak();
				}
			}, 1000);
		} else {
			clearInterval(timerID.current);
		}
	}, [isOnBreak, isTimerRunning, startBreak, startSession, timeLeft]);

	const onStartStopClicked = () => {
		setIsTimerRunning(!isTimerRunning);
	};

	const onResetClicked = () => {
		if (beepEl.current) {
			beepEl.current.pause();
			beepEl.current.currentTime = 0;
		}

		setIsTimerRunning(false);
		setBreakLength(5);
		setSessionLength(25);
		setTimeLeft(25 * 60);
		setIsOnBreak(false);
		clearInterval(timerID.current);
	};

	const _setSessionLength = (v: number) => {
		if (isTimerRunning) return;
		if (v <= 0) {
			setSessionLength(1);
			setTimeLeft(1 * 60);
		} else if (v > 60) {
			setSessionLength(60);
			setTimeLeft(60 * 60);
		} else {
			setSessionLength(v);
			setTimeLeft(v * 60);
		}
	};

	const _setBreakLength = (v: number) => {
		if (isTimerRunning) return;
		if (v <= 0) {
			setBreakLength(1);
		} else if (v > 60) {
			setBreakLength(60);
		} else {
			setBreakLength(v);
		}
	};

	return (
		<div className="App m-auto w-full flex flex-col justify-center items-center gap-5 text-lg">
			<div className="flex justify-center gap-5">
				<div className="flex flex-col justify-center items-center text-center w-[130px]">
					<div id="session-label">Session Length</div>
					<div className="flex w-full text-4xl justify-center">
						<button
							className="w-1/3"
							id="session-decrement"
							onClick={() => _setSessionLength(sessionLength - 1)}
						>
							-
						</button>
						<div className="w-1/3" id="session-length">
							{sessionLength}
						</div>
						<button
							className="w-1/3"
							id="session-increment"
							onClick={() => _setSessionLength(sessionLength + 1)}
						>
							+
						</button>
					</div>
				</div>

				<div className="flex flex-col justify-center items-center text-center w-[130px]">
					<div id="break-label">Break Length</div>
					<div className="flex w-full text-4xl justify-center">
						<button className="w-1/3" id="break-decrement" onClick={() => _setBreakLength(breakLength - 1)}>
							-
						</button>
						<div className="w-1/3" id="break-length">
							{breakLength}
						</div>
						<button className="w-1/3" id="break-increment" onClick={() => _setBreakLength(breakLength + 1)}>
							+
						</button>
					</div>
				</div>
			</div>

			<div className="flex flex-col items-center">
				<div id="timer-label">{isOnBreak ? 'Break' : 'Session'}</div>
				<div className="text-4xl" id="time-left">
					{formatTime(timeLeft)}
				</div>
			</div>

			<div className="flex justify-center  gap-16 text-3xl mt-5">
				<button id="start_stop" onClick={() => onStartStopClicked()}>
					{isTimerRunning ? 'Stop' : 'Start'}
				</button>
				<button id="reset" onClick={onResetClicked}>
					Reset
				</button>
			</div>

			<audio src={beep} id="beep" ref={beepEl}></audio>
		</div>
	);
}

export default App;
