let countdown;
let timeLeft = 3;
let totalDuration = 30;
let isPaused = false;
let circle = document.querySelector(".progress-ring__circle");
let radius = circle.r.baseVal.value;
let circumference = 2 * Math.PI * radius;
let tick = document.getElementById("tick");
let bell = document.getElementById("bell");

circle.style.strokeDasharray = `${circumference}`;
circle.style.strokeDashoffset = `${circumference}`;

function setProgress(time) {
  const percent = time / totalDuration;
  const offset = circumference * (1 - percent);
  circle.style.strokeDashoffset = offset;
}

function updateTime() {
  document.getElementById("time").textContent = timeLeft;
  setProgress(timeLeft);
}

function startTimer() {
  if (countdown || timeLeft <= 0) return;
  isPaused = false;
  tick.loop = true;
  tick.play();
  countdown = setInterval(() => {
    if (!isPaused) {
      timeLeft--;
      updateTime();
      if (timeLeft <= 0) {
        clearInterval(countdown);
        countdown = null;
        tick.pause();
        tick.currentTime = 0;
        bell.play();
      }
    }
  }, 1000);
}

function pauseTimer() {
  isPaused = !isPaused;
  if (isPaused) {
    tick.pause();
  } else {
    tick.play();
  }
}

function resetTimer() {
  clearInterval(countdown);
  countdown = null;
  timeLeft = 3;
  updateTime();
  tick.pause();
  tick.currentTime = 0;
  bell.pause();
  bell.currentTime = 0;
}
updateTime();
