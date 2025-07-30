const bells = new Audio('./sounds/bells.wav');
const startBtn = document.querySelector('.btn-start');
const resetBtn = document.querySelector('.btn-reset');
const pauseBtn = document.querySelector('.btn-pause');
const plusBtn = document.querySelector('.btn-plus');
const minusBtn = document.querySelector('.btn-minus');
const breakBtn = document.querySelector('.btn-break');
const workBtn = document.querySelector('.btn-work')
const settingsBtn = document.querySelector('.btn-settings');
const closeBtn = document.querySelector('.btn-close-settings');
const applyBtn = document.querySelector('.btn-apply-settings');
const themeToggleBtn = document.querySelector('.toggle-theme');
const themeIcon = themeToggleBtn.querySelector('img');
const sessionInput = document.getElementById('sessionLength');
const breakInput = document.getElementById('breakLength');
const autoNextCheckbox = document.getElementById('autoNext');
const settingsMenu = document.querySelector('.off-screen-menu');
const sessionTime = document.querySelector('.session-time');
const session = document.querySelector('.minutes');
const DEFAULT_SESSION_MINUTES = 25;
const DEFAULT_INCREMENT = 5;
let breakMinutes = 5;
let myInterval;
let state = true;
let isPaused = false;
let totalSeconds;
let elapsedSeconds = 0;
let rotationAngle = 0;

const updateCircleProgress = () => {
    const totalTime = parseInt(session.textContent) * 60;
    const progress = elapsedSeconds / totalTime;
    const degrees = Math.min(progress * 360, 360);

    const left = document.querySelector('.left-side.circle');
    const right = document.querySelector('.right-side.circle');

    if (degrees <= 180) {
    right.style.transform = `rotate(${degrees}deg)`;
    left.style.transform = `rotate(0deg)`;
  } else {
    right.style.transform = `rotate(180deg)`;
    left.style.transform = `rotate(${degrees - 180}deg)`;
  }
};

const resetCircle = () => {
  document.querySelector('.left-side.circle').style.transform = 'rotate(0deg)';
  document.querySelector('.right-side.circle').style.transform = 'rotate(0deg)';
};

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
    pauseBtn.textContent = '⏸';
  }

  elapsedSeconds++;
  updateCircleProgress();
};

const appTimer = () => {
    const sessionAmount = Number.parseInt(session.textContent);
    elapsedSeconds = 0;
    updateCircleProgress();

    if (state) {
      state = false;
      isPaused = false;
      totalSeconds = sessionAmount * 60;
      myInterval = setInterval(updateSeconds, 1000);
      pauseBtn.textContent = '⏸';
    } else if (isPaused){ 
      isPaused = false
      myInterval = setInterval(updateSeconds, 1000);
      pauseBtn.textContent = '⏸';
    } else {
      alert('Session has already started.')
    }
};

startBtn.addEventListener('click', appTimer)

const resetTimer = () => {
  const minuteDiv = document.querySelector('.minutes');
  const secondDiv = document.querySelector('.seconds');
  elapsedSeconds = 0;
  updateCircleProgress();
  clearInterval(myInterval); 
  state = true;
  isPaused = false;
  pauseBtn.textContent = '⏸';

  minuteDiv.textContent = DEFAULT_SESSION_MINUTES;
  secondDiv.textContent = '00';
  sessionTime.textContent = DEFAULT_SESSION_MINUTES;
};

resetBtn.addEventListener('click', resetTimer);

const pauseTimer = () => {
    if (!state && !isPaused) {
    clearInterval(myInterval);
    isPaused = true;
    pauseBtn.textContent = '▶';
    } else if (!state && isPaused) {
    myInterval = setInterval(updateSeconds, 1000);
    isPaused = false;
    pauseBtn.textContent = '⏸';
    }
};

pauseBtn.addEventListener('click', pauseTimer);

const addTime = () => {
  const current = parseInt(sessionTime.textContent);

  if (state) {
    if (current < 60) {
      let newTime = current + DEFAULT_INCREMENT;
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
      let newTime = current - DEFAULT_INCREMENT;
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
  elapsedSeconds = 0;
  updateCircleProgress();

  if (state || isPaused) {
    sessionTime.textContent = breakMinutes;
    session.textContent = breakMinutes;
    document.querySelector('.seconds').textContent = '00';

    if (isPaused) {
      totalSeconds = breakMinutes * 60;
    }
  }

  if (!state && !isPaused) {
    showPopup('please pause before changing time');
    return;
    }
}; 

breakBtn.addEventListener('click', breakTime);

const workTime = () => {
  elapsedSeconds = 0;
  updateCircleProgress();

  if (state || isPaused) {
    sessionTime.textContent = DEFAULT_SESSION_MINUTES;
    session.textContent = DEFAULT_SESSION_MINUTES;
    document.querySelector('.seconds').textContent = '00';

    if (isPaused) {
      totalSeconds = DEFAULT_SESSION_MINUTES * 60; 
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

settingsBtn.addEventListener('click', () => {
  settingsMenu.classList.toggle('active');
});

closeBtn.addEventListener('click', () => {
  settingsMenu.classList.remove('active');
});

applyBtn.addEventListener('click', () => {
  const newSession = parseInt(sessionInput.value);
  const newBreak = parseInt(breakInput.value);

  if (newSession >= 1 && newSession <= 60) {
    session.textContent = newSession;
    sessionTime.textContent = newSession;
  }

  if (newBreak >= 1 && newBreak <= 60) {
    breakMinutes = newBreak;
  }

  autoNext = autoNextCheckbox.checked;

  settingsMenu.classList.remove('active');
});

themeToggleBtn.addEventListener('click',  () => {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';

  if (isDark) {
    html.removeAttribute('data-theme');
    themeIcon.src = 'icons/light_mode_24dp_E3E3E3_FILL1_wght400_GRAD0_opsz24.svg';
    themeIcon.alt = 'Light mode Icon';
  } else {
    html.setAttribute('data-theme', 'dark');
    themeIcon.src = 'icons/dark_mode_24dp_E3E3E3_FILL1_wght400_GRAD0_opsz24.svg';
    themeIcon.alt = 'Dark mode Icon';
  }
});