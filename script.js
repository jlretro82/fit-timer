const countdownEl = document.getElementById("countdown");
const getReadyEl = document.getElementById("getReady");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const circle = document.querySelector(".progress-ring__circle");

const radius = 45;
const circumference = 2 * Math.PI * radius;
circle.style.strokeDasharray = `${circumference}`;
circle.style.strokeDashoffset = `${circumference}`;

const tickSound = document.getElementById("tick");
const bellSound = document.getElementById("bell");

let totalTime = 30;
let getReadyTime = 3;
let currentTime = getReadyTime;
let interval = null;
let isRunning = false;
let isGetReady = true;

function setCircleProgress(time) {
  const offset = circumference - (time / totalTime) * circumference;
  circle.style.strokeDashoffset = offset;
}

function updateDisplay() {
  countdownEl.textContent = currentTime;
  if (!isGetReady) {
    setCircleProgress(currentTime);
  }
}

function tick() {
  if (currentTime > 0) {
    currentTime--;
    updateDisplay();
    if (!isGetReady) tickSound.play();
  } else {
    clearInterval(interval);
    interval = null;
    isRunning = false;
    tickSound.pause();
    tickSound.currentTime = 0;
    bellSound.play();
  }
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;

  if (isGetReady) {
    countdownEl.textContent = getReadyTime;
    interval = setInterval(() => {
      if (currentTime > 1) {
        currentTime--;
        updateDisplay();
      } else {
        clearInterval(interval);
        isGetReady = false;
        currentTime = totalTime;
        getReadyEl.style.display = "none";
        updateDisplay();
        setCircleProgress(currentTime);
        startTimer();
      }
    }, 1000);
  } else {
    interval = setInterval(tick, 1000);
  }
}

function pauseTimer() {
  if (interval) {
    clearInterval(interval);
    interval = null;
    tickSound.pause();
  }
  isRunning = false;
}

function resetTimer() {
  pauseTimer();
  isGetReady = true;
  getReadyEl.style.display = "block";
  currentTime = getReadyTime;
  updateDisplay();
  setCircleProgress(totalTime);
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

resetTimer();
