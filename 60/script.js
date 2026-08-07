const duration = 60;

let timeLeft = duration;
let isPaused = false;
let isRunning = false;
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

function setCircleProgress(percent) {
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
}

function stopTickSound() {
  tickSound.pause();
  tickSound.currentTime = 0;
}

function stopBellSound() {
  bellSound.pause();
  bellSound.currentTime = 0;
}

function playTickSound() {
  tickSound.loop = false;
  tickSound.currentTime = 0;

  const playPromise = tickSound.play();

  if (playPromise !== undefined) {
    playPromise.catch(() => {});
  }
}

function playBellSound() {
  bellSound.loop = false;
  bellSound.currentTime = 0;

  const playPromise = bellSound.play();

  if (playPromise !== undefined) {
    playPromise.catch(() => {});
  }
}

/*
  The ticking file is about 49 seconds long.

  Restart it slightly BEFORE it reaches the end so there
  isn't a silent gap when the audio file finishes.
*/
tickSound.addEventListener("timeupdate", () => {
  if (
    isRunning &&
    !isPaused &&
    tickSound.duration &&
    tickSound.currentTime >= tickSound.duration - 0.25
  ) {
    tickSound.currentTime = 0;

    if (tickSound.paused) {
      tickSound.play().catch(() => {});
    }
  }
});

function resetAll() {
  clearInterval(mainInterval);
  clearInterval(readyInterval);

  mainInterval = null;
  readyInterval = null;

  isPaused = false;
  isRunning = false;
  timeLeft = duration;

  stopTickSound();
  stopBellSound();

  countdownEl.textContent = "3";
  getReadyEl.textContent = "Get Ready";
  getReadyEl.style.display = "block";

  pauseBtn.textContent = "Pause";

  circle.style.strokeDashoffset = circumference;
}

function startGetReady() {
  let readyCount = 3;

  countdownEl.textContent = readyCount;
  getReadyEl.textContent = "Get Ready";
  getReadyEl.style.display = "block";

  readyInterval = setInterval(() => {
    if (isPaused) return;

    readyCount--;

    if (readyCount > 0) {
      countdownEl.textContent = readyCount;
    } else {
      clearInterval(readyInterval);
      readyInterval = null;

      getReadyEl.style.display = "none";
      countdownEl.textContent = duration;

      startMainTimer();
    }
  }, 1000);
}

function startMainTimer() {
  isRunning = true;
  timeLeft = duration;

  countdownEl.textContent = timeLeft;

  playTickSound();

  mainInterval = setInterval(() => {
    if (isPaused) return;

    timeLeft = Math.max(0, timeLeft - 1);

    countdownEl.textContent = timeLeft;

    const progress =
      ((duration - timeLeft) / duration) * 100;

    setCircleProgress(progress);

    if (timeLeft <= 0) {
      clearInterval(mainInterval);
      mainInterval = null;

      isRunning = false;

      stopTickSound();
      playBellSound();
    }
  }, 1000);
}

function startHandler() {
  if (isRunning) return;

  resetAll();
  startGetReady();
}

function pauseHandler() {
  if (!isRunning) return;

  isPaused = !isPaused;

  if (isPaused) {
    pauseBtn.textContent = "Resume";
    tickSound.pause();
  } else {
    pauseBtn.textContent = "Pause";

    tickSound.play().catch(() => {});
  }
}

startBtn.addEventListener("click", startHandler);
pauseBtn.addEventListener("click", pauseHandler);
resetBtn.addEventListener("click", resetAll);

resetAll();