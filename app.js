const bells = new Audio('./sounds/bells.wav');
const startBtn = document.querySelector('.btn-start');
const resetBtn = document.querySelector('.btn-reset');
const pauseBtn = document.querySelector('.btn-pause');
const plusBtn = document.querySelector('.btn-plus');
const minusBtn = document.querySelector('.btn-minus');
const breakBtn = document.querySelector('.btn-break');
const workBtn = document.querySelector('.btn-work')
const sessionTime = document.querySelector('.session-time');
const session = document.querySelector('.minutes');
const DEFAULT_SESSION_MINUTES = 25;
const DEFAULT_BREAK_MINUTES = 5;
const DEFAULT_INCREMENT = 5;
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
    bells.play().catch(error => {
      console.log('Could not play audio: ', error);
    })
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
      pauseBtn.textContent = 'pause';
    } else if (isPaused){ 
      isPaused = false
      myInterval = setInterval(updateSeconds, 1000);
      pauseBtn.textContent = 'pause';
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
  sessionTime.textContent = '25';
};

resetBtn.addEventListener('click', resetTimer);

const pauseTimer = () => {
  if (!state && !isPaused) {
    clearInterval(myInterval);
    isPaused = true;
    pauseBtn.textContent = 'resume';
  } else if (!state && isPaused) {
    myInterval = setInterval(updateSeconds, 1000);
    isPaused = false;
    pauseBtn.textContent = 'pause';
  }
};

pauseBtn.addEventListener('click', pauseTimer);

const addTime = () => {
  const current = parseInt(sessionTime.textContent);

  if (state) {
    if (current < 60) {
      let newTime = current + 5;
      sessionTime.textContent = newTime;
      session.textContent = newTime;
    } 
  }

  if (!state && !isPaused) {
  showPopup('please pause before changing time');
  return;
    }
};

plusBtn.addEventListener('click', addTime);

const subtractTime = () => {
  const current = parseInt(sessionTime.textContent);
    
  if (state) {
    if (current > 5) {
      let newTime = current - 5;
      sessionTime.textContent = newTime;
      session.textContent = newTime;
    } 
  }
    
  if (!state && !isPaused) {
  showPopup('please pause before changing time');
  return;
    }
};

minusBtn.addEventListener('click', subtractTime);

const breakTime = () => {
  if (state || isPaused) {
    sessionTime.textContent = DEFAULT_BREAK_MINUTES;
    session.textContent = DEFAULT_BREAK_MINUTES;
    document.querySelector('.seconds').textContent = '00';

    if (isPaused) {
      totalSeconds = 5 * 60;
    }
  }

  if (!state && !isPaused) {
    showPopup('please pause before changing time');
    return;
    }
}; 

breakBtn.addEventListener('click', breakTime);

const workTime = () => {
  if (state || isPaused) {
    sessionTime.textContent = DEFAULT_SESSION_MINUTES;
    session.textContent = DEFAULT_SESSION_MINUTES;
    document.querySelector('.seconds').textContent = '00';

    if (isPaused) {
      totalSeconds = 25 * 60; 
    }
  }

  if (!state && !isPaused) {
    showPopup('please pause before changing time');
    return;
    }
}; 

workBtn.addEventListener('click', workTime);

const showPopup = (message, duration = 1400) => {
  const popup = document.getElementById('popup');
  popup.textContent = message;
  popup.classList.add('show');

  setTimeout(() => {
    popup.classList.remove('show');
  }, duration)
};