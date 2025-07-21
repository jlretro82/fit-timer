
let duration = 30; // This value will be overridden in the 20/40 folders
let countdown;
let countdownValue;
let isPaused = false;
let isReady = true;

const display = document.getElementById('time');
const getReadyText = document.getElementById('getReady');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const circle = document.querySelector('.circle');
const tickSound = new Audio('tick.mp3');
const bellSound = new Audio('bell.mp3');

tickSound.loop = true;

function setCircleProgress(value) {
    const offset = 125.6 - (125.6 * value / duration);
    circle.style.strokeDashoffset = offset;
}

function startTimer() {
    if (isReady) {
        let readyCount = 3;
        display.textContent = readyCount;
        getReadyText.textContent = "Get Ready";
        isReady = false;

        const readyInterval = setInterval(() => {
            readyCount--;
            display.textContent = readyCount;
            if (readyCount === 0) {
                clearInterval(readyInterval);
                getReadyText.textContent = "";
                countdownValue = duration;
                display.textContent = countdownValue;
                setCircleProgress(duration);
                tickSound.play();

                countdown = setInterval(() => {
                    if (!isPaused) {
                        countdownValue--;
                        display.textContent = countdownValue;
                        setCircleProgress(countdownValue);
                        if (countdownValue <= 0) {
                            clearInterval(countdown);
                            tickSound.pause();
                            tickSound.currentTime = 0;
                            bellSound.play();
                        }
                    }
                }, 1000);
            }
        }, 1000);
    }
}

function pauseTimer() {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
    if (isPaused) {
        tickSound.pause();
    } else {
        tickSound.play();
    }
}

function resetTimer() {
    clearInterval(countdown);
    tickSound.pause();
    tickSound.currentTime = 0;
    bellSound.pause();
    bellSound.currentTime = 0;
    isPaused = false;
    isReady = true;
    getReadyText.textContent = "Get Ready";
    display.textContent = "3";
    pauseBtn.textContent = "Pause";
    setCircleProgress(duration);
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
