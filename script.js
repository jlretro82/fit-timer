
let timeLeft = 3;
let interval;
let prepInterval;
let current;
const timeDisplay = document.getElementById("time");
const getReadyText = document.getElementById("get-ready");
const circle = document.querySelector("circle");
const radius = 45;
const circumference = 2 * Math.PI * radius;

circle.style.strokeDasharray = circumference;
circle.style.strokeDashoffset = circumference;

function startPrepCountdown() {
  let prepTime = 3;
  timeDisplay.textContent = prepTime;
  getReadyText.style.display = "block";
  prepInterval = setInterval(() => {
    prepTime--;
    if (prepTime <= 0) {
      clearInterval(prepInterval);
      getReadyText.style.display = "none";
      timeLeft = duration;
      timeDisplay.textContent = timeLeft;
      startCountdown();
    } else {
      timeDisplay.textContent = prepTime;
    }
  }, 1000);
}

function startCountdown() {
  let startTime = duration;
  let timePassed = 0;
  interval = setInterval(() => {
    timePassed++;
    timeLeft = startTime - timePassed;
    timeDisplay.textContent = timeLeft;
    const offset = circumference - (timePassed / startTime) * circumference;
    circle.style.strokeDashoffset = offset;

    if (timeLeft <= 0) {
      clearInterval(interval);
      circle.style.strokeDashoffset = 0;
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(interval);
  clearInterval(prepInterval);
}

function resetTimer() {
  clearInterval(interval);
  clearInterval(prepInterval);
  circle.style.strokeDashoffset = circumference;
  timeDisplay.textContent = 3;
  getReadyText.style.display = "block";
}

function startTimer() {
  resetTimer();
  startPrepCountdown();
}
