const duration = 60;

let timeLeft = duration;
let readyCount = 3;
let phase = "idle";
let mainInterval = null;
let readyInterval = null;

const countdownEl = document.getElementById("countdown");
const getReadyEl = document.getElementById("getReady");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

const tickSound = document.getElementById("tickSound");
const bellSound = document.getElementById("bellSound");

const circle = document.querySelector(".progress-ring__circle");

const radius = circle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;

/*
  The tick MP3 is about 49 seconds long.

  We restart it well BEFORE the end so the browser never
  reaches the MP3 end padding / loop gap.
*/
const TICK_RESTART_POINT = 44.999;

function setCircleProgress(percent) {
  const offset =
    circumference - (percent / 100) * circumference;

  circle.style.strokeDashoffset = offset;
}

function stopTickSound() {
  tickSound.pause();

  try {
    tickSound.currentTime = 0;
  } catch (e) {}
}

function stopBellSound() {
  bellSound.pause();

  try {
    bellSound.currentTime = 0;
  } catch (e) {}
}

function startTickSound() {
  tickSound.loop = false;

  try {
    tickSound.currentTime = 0;
  } catch (e) {}

  tickSound.play().catch(() => {});
}

/*
  IMPORTANT:
  This keeps the ticking continuous by jumping back to
  the beginning BEFORE the 49-second file reaches its end.
*/
tickSound.addEventListener("timeupdate", () => {
  if (
    phase === "running" &&
    tickSound.currentTime >= TICK_RESTART_POINT
  ) {
    tickSound.pause();
    tickSound.currentTime = 0;
    tickSound.play().catch(() => {});
  }
});

function resetAll() {
  clearInterval(readyInterval);
  clearInterval(mainInterval);

  readyInterval = null;
  mainInterval = null;

  phase = "idle";
  timeLeft = duration;
  readyCount = 3;

  stopTickSound();
  stopBellSound();

  getReadyEl.style.display = "block";
  getReadyEl.textContent = "Get Ready";

  countdownEl.textContent = "3";

  pauseBtn.textContent = "Pause";

  circle.style.strokeDashoffset = circumference;
}

function startGetReady() {
  phase = "ready";
  readyCount = 3;

  /*
    NO TICKING SOUND during Get Ready.
  */
  stopTickSound();

  getReadyEl.style.display = "block";
  getReadyEl.textContent = "Get Ready";
  countdownEl.textContent = readyCount;

  readyInterval = setInterval(() => {
    if (phase !== "ready") return;

    readyCount--;

    if (readyCount > 0) {
      countdownEl.textContent = readyCount;
    } else {
      clearInterval(readyInterval);
      readyInterval = null;

      startMainTimer();
    }
  }, 1000);
}

function startMainTimer() {
  phase = "running";
  timeLeft = duration;

  getReadyEl.style.display = "none";
  countdownEl.textContent = timeLeft;

  setCircleProgress(0);

  /*
    Ticking begins HERE — when the actual
    60-second workout timer begins.
  */
  startTickSound();

  mainInterval = setInterval(() => {
    if (phase !== "running") return;

    timeLeft = Math.max(0, timeLeft - 1);

    countdownEl.textContent = timeLeft;

    const progress =
      ((duration - timeLeft) / duration) * 100;

    setCircleProgress(progress);

    if (timeLeft === 0) {
      finishTimer();
    }
  }, 1000);
}

function finishTimer() {
  clearInterval(mainInterval);
  mainInterval = null;

  phase = "done";

  stopTickSound();

  bellSound.loop = false;

  try {
    bellSound.currentTime = 0;
  } catch (e) {}

  bellSound.play().catch(() => {});

  pauseBtn.textContent = "Pause";
}

function startHandler() {
  if (
    phase === "ready" ||
    phase === "running" ||
    phase === "paused"
  ) {
    return;
  }

  resetAll();
  startGetReady();
}

function pauseHandler() {
  if (phase === "running") {
    phase = "paused";
    pauseBtn.textContent = "Resume";

    tickSound.pause();

    return;
  }

  if (phase === "paused") {
    phase = "running";
    pauseBtn.textContent = "Pause";

    tickSound.play().catch(() => {});
  }
}

startBtn.addEventListener("click", startHandler);
pauseBtn.addEventListener("click", pauseHandler);
resetBtn.addEventListener("click", resetAll);

resetAll();
