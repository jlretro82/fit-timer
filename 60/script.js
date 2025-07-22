const duration = 40;
let timeLeft = duration;
let isPaused = false;
let isRunning = false;

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
circle.style.strokeDasharray = circumference;
circle.style.strokeDashoffset = circumference;

function setCircleProgress(percent) {
  circle.style.strokeDashoffset = circumference - (percent / 100) * circumference;
}

function resetAll() {
  clearInterval(window.mainInterval);
  isPaused = false;
  isRunning = false;
  timeLeft = duration;
  countdownEl.textContent = "3";
  getReadyEl.textContent = "Get Ready";
  getReadyEl.style.display = "block";
  pauseBtn.textContent = "Pause";
  circle.style.strokeDashoffset = circumference;
  tickSound.pause();
  tickSound.currentTime = 0;
}

function startGetReady() {
  let count = 3;
  countdownEl.textContent = count;
  getReadyEl.style.display = "block";
  tickSound.currentTime = 0;
  tickSound.play();
  let readyInterval = setInterval(() => {
    if (!isPaused) {
      count--;
      if (count > 0) {
        countdownEl.textContent = count;
        tickSound.currentTime = 0;
        tickSound.play();
      } else {
        clearInterval(readyInterval);
        getReadyEl.style.display = "none";
        countdownEl.textContent = timeLeft;
        startMain();
      }
    }
  }, 1000);
}

function startMain() {
  isRunning = true;
  tickSound.loop = true;
  tickSound.currentTime = 0;
  tickSound.play();
  window.mainInterval = setInterval(() => {
    if (!isPaused) {
      timeLeft--;
      countdownEl.textContent = timeLeft;
      setCircleProgress(((duration - timeLeft) / duration) * 100);
      if (timeLeft <= 0) {
        clearInterval(window.mainInterval);
        tickSound.pause();
        tickSound.currentTime = 0;
        bellSound.play();
      }
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
  pauseBtn.textContent = isPaused ? "Resume" : "Pause";
  if (isPaused) {
    tickSound.pause();
  } else {
    tickSound.play();
  }
}

startBtn.addEventListener("click", startHandler);
pauseBtn.addEventListener("click", pauseHandler);
resetBtn.addEventListener("click", resetAll);

resetAll();
