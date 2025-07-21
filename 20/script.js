
let duration = 20;
let timeLeft = duration;
let isPaused = false;
let isRunning = false;
let countdownEl = document.getElementById("countdown");
let getReadyEl = document.getElementById("getReady");
let startBtn = document.getElementById("startBtn");
let pauseBtn = document.getElementById("pauseBtn");
let resetBtn = document.getElementById("resetBtn");
let tickSound = document.getElementById("tickSound");
let bellSound = document.getElementById("bellSound");
let interval;
let readyInterval;
const circle = document.querySelector(".progress-ring__circle");
const radius = circle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;
circle.style.strokeDasharray = circumference;
circle.style.strokeDashoffset = circumference;

function setCircleProgress(percent) {
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
}

function playTick() {
  tickSound.currentTime = 0;
  tickSound.play();
}

function stopTick() {
  tickSound.pause();
  tickSound.currentTime = 0;
}

function playBell() {
  bellSound.currentTime = 0;
  bellSound.play();
}

function resetAll() {
  clearInterval(interval);
  clearInterval(readyInterval);
  isPaused = false;
  isRunning = false;
  timeLeft = duration;
  getReadyEl.style.display = "block";
  getReadyEl.textContent = "Get Ready";
  countdownEl.textContent = "3";
  setCircleProgress(0);
  pauseBtn.textContent = "Pause";
  stopTick();
}

function startGetReadyCountdown() {
  let count = 3;
  countdownEl.textContent = count;
  getReadyEl.style.display = "block";
  playTick();
  readyInterval = setInterval(() => {
    count--;
    if (count >= 0) {
      countdownEl.textContent = count;
      playTick();
    } else {
      clearInterval(readyInterval);
      getReadyEl.style.display = "none";
      countdownEl.textContent = timeLeft;
      startMainTimer();
    }
  }, 1000);
}

function startMainTimer() {
  isRunning = true;
  const startTime = Date.now();
  const endTime = startTime + timeLeft * 1000;

  tickSound.loop = true;
  playTick();

  interval = setInterval(() => {
    if (!isPaused) {
      const now = Date.now();
      timeLeft = Math.max(0, Math.ceil((endTime - now) / 1000));
      countdownEl.textContent = timeLeft;
      const progress = ((duration - timeLeft) / duration) * 100;
      setCircleProgress(progress);

      if (timeLeft <= 0) {
        clearInterval(interval);
        stopTick();
        playBell();
      }
    }
  }, 1000);
}

startBtn.addEventListener("click", () => {
  if (isRunning) return;
  resetAll();
  startGetReadyCountdown();
});

pauseBtn.addEventListener("click", () => {
  if (!isRunning) return;
  isPaused = !isPaused;
  if (isPaused) {
    pauseBtn.textContent = "Resume";
    tickSound.pause();
  } else {
    pauseBtn.textContent = "Pause";
    tickSound.play();
  }
});

resetBtn.addEventListener("click", () => {
  resetAll();
});

resetAll();
