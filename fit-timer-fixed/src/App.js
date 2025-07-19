import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const App = () => {
  const [phase, setPhase] = useState("idle");
  const [readySeconds, setReadySeconds] = useState(5);
  const [mainSeconds, setMainSeconds] = useState(30);
  const [readyTimer, setReadyTimer] = useState(5);
  const [mainTimer, setMainTimer] = useState(30);
  const tickSound = useRef(null);
  const bellSound = useRef(null);

  useEffect(() => {
    let timer;

    if (phase === "get-ready" && readyTimer > 0) {
      timer = setTimeout(() => {
        setReadyTimer(prev => prev - 1);
        tickSound.current?.play();
      }, 1000);
    } else if (phase === "get-ready" && readyTimer === 0) {
      setPhase("countdown");
    } else if (phase === "countdown" && mainTimer > 0) {
      timer = setTimeout(() => {
        setMainTimer(prev => prev - 1);
        tickSound.current?.play();
      }, 1000);
    } else if (phase === "countdown" && mainTimer === 0) {
      bellSound.current?.play();
      setPhase("finished");
    }

    return () => clearTimeout(timer);
  }, [phase, readyTimer, mainTimer]);

  const start = () => {
    setReadyTimer(readySeconds);
    setMainTimer(mainSeconds);
    setPhase("get-ready");
  };

  const pause = () => setPhase("paused");

  const resume = () => {
    if (readyTimer > 0) setPhase("get-ready");
    else setPhase("countdown");
  };

  const stop = () => {
    setPhase("idle");
    setReadyTimer(readySeconds);
    setMainTimer(mainSeconds);
  };

  const label = {
    idle: "Ready to Begin",
    "get-ready": "Get Ready",
    countdown: "Go!",
    finished: "Done!",
    paused: "Paused"
  };

  const time = {
    idle: "",
    "get-ready": readyTimer,
    countdown: mainTimer,
    finished: "",
    paused: readyTimer > 0 ? readyTimer : mainTimer
  };

  return (
    <div className="timer-container">
      <audio ref={tickSound} src="/tick.mp3" />
      <audio ref={bellSound} src="/bell.mp3" />
      <h1 className="timer-label">{label[phase]}</h1>
      <div className="timer-value">{time[phase]}</div>
      <div className="button-group">
        {(phase === "idle" || phase === "finished") && (
          <button className="btn" onClick={start}>Start</button>
        )}
        {(phase === "get-ready" || phase === "countdown") && (
          <button className="btn" onClick={pause}>Pause</button>
        )}
        {phase === "paused" && (
          <button className="btn" onClick={resume}>Resume</button>
        )}
        {(phase !== "idle" && phase !== "finished") && (
          <button className="btn" onClick={stop}>Stop</button>
        )}
      </div>
    </div>
  );
};

export default App;
