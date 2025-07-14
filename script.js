const addTimerBtn = document.getElementById('addTimerBtn');
const timersContainer = document.getElementById('timersContainer');
const timerTemplate = document.getElementById('timerTemplate');

let timerCount = 0;

function attachFunctionality(timerBlock) {
  const startBtn = timerBlock.querySelector('.start-btn');
  const cancelBtn = timerBlock.querySelector('.cancel-btn');
  const dateInput = timerBlock.querySelector('input[type="date"]');
  const timeInput = timerBlock.querySelector('input[type="time"]');
  const countdownDiv = timerBlock.querySelector('.countdown');
  const messageDiv = timerBlock.querySelector('.message');
  const closeBtn = timerBlock.querySelector('.close-btn');

  const daysEl = countdownDiv.querySelector('.days');
  const hoursEl = countdownDiv.querySelector('.hours');
  const minutesEl = countdownDiv.querySelector('.minutes');
  const secondsEl = countdownDiv.querySelector('.seconds');

  let intervalId = null;
  let hideTimeoutId = null;
  let countdownMessageIntervalId = null;
  let countdownSeconds = 15;

  function updateCountdown(targetTime) {
    const now = Date.now();
    const distance = targetTime - now;

    if (distance <= 0) {
      clearInterval(intervalId);
      intervalId = null;
      messageDiv.textContent = "🎉 Time's up!";
      cancelBtn.disabled = true;
      countdownDiv.classList.remove('hidden');
      timerBlock.classList.add('ended');

      countdownSeconds = 15;
      messageDiv.textContent = `🎉 Time's up! This timer will be deleted in ${countdownSeconds} seconds...`;

      countdownMessageIntervalId = setInterval(() => {
        countdownSeconds--;
        if (countdownSeconds > 0) {
          messageDiv.textContent = `🎉 Time's up! This timer will be deleted in ${countdownSeconds} seconds...`;
        } else {
          clearInterval(countdownMessageIntervalId);
          countdownMessageIntervalId = null;
          timerBlock.classList.add('fade-out');
          setTimeout(() => timerBlock.remove(), 1000);
        }
      }, 1000);

      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = days;
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  startBtn.addEventListener('click', () => {
    if (intervalId) clearInterval(intervalId);
    if (hideTimeoutId) {
      clearTimeout(hideTimeoutId);
      hideTimeoutId = null;
      timerBlock.classList.remove('fade-out');
    }
    if (countdownMessageIntervalId) {
      clearInterval(countdownMessageIntervalId);
      countdownMessageIntervalId = null;
    }
    timerBlock.classList.remove('ended');
    messageDiv.textContent = '';

    if (!dateInput.value || !timeInput.value) {
      messageDiv.textContent = 'Please select both date and time.';
      countdownDiv.classList.add('hidden');
      cancelBtn.disabled = true;
      return;
    }

    const targetDateTime = new Date(`${dateInput.value}T${timeInput.value}:00`).getTime();

    if (isNaN(targetDateTime)) {
      messageDiv.textContent = 'Invalid date/time selected.';
      countdownDiv.classList.add('hidden');
      cancelBtn.disabled = true;
      return;
    }

    if (targetDateTime <= Date.now()) {
      messageDiv.textContent = 'Please select a future date and time.';
      countdownDiv.classList.add('hidden');
      cancelBtn.disabled = true;
      return;
    }

    countdownDiv.classList.remove('hidden');
    updateCountdown(targetDateTime);

    intervalId = setInterval(() => {
      updateCountdown(targetDateTime);
    }, 1000);

    cancelBtn.disabled = false;
  });

  cancelBtn.addEventListener('click', () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (hideTimeoutId) {
      clearTimeout(hideTimeoutId);
      hideTimeoutId = null;
    }
    if (countdownMessageIntervalId) {
      clearInterval(countdownMessageIntervalId);
      countdownMessageIntervalId = null;
    }
    countdownDiv.classList.add('hidden');
    messageDiv.textContent = 'Countdown cancelled.';
    cancelBtn.disabled = true;
    timerBlock.classList.remove('ended');
    timerBlock.classList.remove('fade-out');
  });

  closeBtn.addEventListener('click', () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    if (hideTimeoutId) {
      clearTimeout(hideTimeoutId);
    }
    if (countdownMessageIntervalId) {
      clearInterval(countdownMessageIntervalId);
    }
    timerBlock.remove();
  });
}

addTimerBtn.addEventListener('click', () => {
  timerCount++;
  const newTimer = timerTemplate.cloneNode(true);
  newTimer.style.display = 'block';
  newTimer.id = `timer-${timerCount}`;
  timersContainer.appendChild(newTimer);
  attachFunctionality(newTimer);
});

// Add one timer on load
addTimerBtn.click();
