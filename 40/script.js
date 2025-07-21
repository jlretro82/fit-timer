let duration = 40; 
let timeLeft = 3;
let interval;
let prepInterval;
let isPaused = false;
let currentPhase = "prep";

const timeDisplay = document.getElementById("time");
const getReadyText = document.getElementById("get-ready");
const circle = document.querySelector("circle");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const tickSound = document.getElementById("tickSound");
const bellSound = document.getElementById("bellSound");

const radius = 45;
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

function resetTimer() {
  clearInterval(interval);
  clearInterval(prepInterval);
  stopTick();
  isPaused = false;
  currentPhase = "prep";
  timeLeft = 3;
  timeDisplay.textContent = timeLeft;
  getReadyText.style.display = "block";
  setCircleProgress(0);
  pauseBtn.textContent = "Pause";
}

function startPrepCountdown() {
  let prepTime = 3;
  timeLeft = prepTime;
  getReadyText.style.display = "block";
  timeDisplay.textContent = prepTime;
  playTick();

  prepInterval = setInterval(() => {
    if (isPaused) return;

    prepTime--;
    if (prepTime >= 0) {
      timeDisplay.textContent = prepTime;
      playTick();
    } else {
      clearInterval(prepInterval);
      getReadyText.style.display = "none";
      startMainCountdown();
    }
  }, 1000);
}

function startMainCountdown() {
  timeLeft = duration;
  currentPhase = "main";
  playTick();
  tickSound.loop = true;

  interval = setInterval(() => {
    if (isPaused) return;

    timeLeft--;
    timeDisplay.textContent = timeLeft;
    const progress = ((duration - timeLeft) / duration) * 100;
    setCircleProgress(progress);

    if (timeLeft <= 0) {
      clearInterval(interval);
      stopTick();
      playBell();
      setCircleProgress(100);
    }
  }, 1000);
}

function startTimer() {
  resetTimer();
  startPrepCountdown();
}

function pauseTimer() {
  isPaused = !isPaused;

  if (isPaused) {
    pauseBtn.textContent = "Resume";
    tickSound.pause();
  } else {
    pauseBtn.textContent = "Pause";
    if (currentPhase === "main") tickSound.play();
  }
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
