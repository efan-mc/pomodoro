const bells = new Audio('./sounds/bells.wav');
const startBtn = document.querySelector('.btn-start');
const resetBtn = document.querySelector('.btn-reset');
const pauseBtn = document.querySelector('.btn-pause');
const session = document.querySelector('.minutes');
const DEFAULT_SESSION_MINUTES = 25;
let myInterval;
let state = true;
let isPaused = false;
let totalSeconds;

const updateSeconds = () => {
  const minuteDiv = document.querySelector('.minutes');
  const secondDiv = document.querySelector('.seconds');

  totalSeconds--;

  let minutesLeft = Math.floor(totalSeconds/60);
  let secondsLeft = totalSeconds % 60;

  if(secondsLeft < 10) {
    secondDiv.textContent = '0' + secondsLeft;
  } else {
    secondDiv.textContent = secondsLeft;
  }
  minuteDiv.textContent = `${minutesLeft}`;

  if(minutesLeft === 0 && secondsLeft === 0) {
    bells.play()
    clearInterval(myInterval);
    state = true;
    isPaused = false;
    pauseBtn.textContent = 'pause';
  }
};

const appTimer = () => {
    const sessionAmount = Number.parseInt(session.textContent);

    if (state) {
        state = false;
        isPaused = false;
        totalSeconds = sessionAmount * 60;
        myInterval = setInterval(updateSeconds, 1000);
    } else {
        alert('Session has already started.')
    }
};

startBtn.addEventListener('click', appTimer)

const resetTimer = () => {
  const minuteDiv = document.querySelector('.minutes');
  const secondDiv = document.querySelector('.seconds');
  clearInterval(myInterval); 
  state = true;
  isPaused = false;
  pauseBtn.textContent = 'pause';

  minuteDiv.textContent = DEFAULT_SESSION_MINUTES;
  secondDiv.textContent = '00';
}

resetBtn.addEventListener('click', resetTimer);

const pauseTimer = () => {
  if (!isPaused) {
    clearInterval(myInterval);
    isPaused = true;
    pauseBtn.textContent = 'resume';
  } else {
    myInterval = setInterval(updateSeconds, 1000);
    isPaused = false;
    pauseBtn.textContent = 'pause';
  }
}

pauseBtn.addEventListener('click', pauseTimer);