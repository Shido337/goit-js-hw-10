import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startBtn = document.querySelector('[data-start]');
const input = document.querySelector('#datetime-picker');
let userSelectedDate = null;
let timerId = null;

const options = {
  enableTime: true,
  time_24h: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const date = selectedDates[0];
    if (date <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
      startBtn.disabled = true;
    } else {
      userSelectedDate = date;
      startBtn.disabled = false;
    }
  },
};

flatpickr(input, options);
startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  input.disabled = true;

  timerId = setInterval(() => {
    const diff = userSelectedDate - new Date();
    if (diff <= 0) {
      clearInterval(timerId);
      updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      input.disabled = false;
      return;
    }
    updateTimer(convertMs(diff));
  }, 1000);
});

function convertMs(ms) {
  const second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24;
  return {
    days: Math.floor(ms / day),
    hours: Math.floor((ms % day) / hour),
    minutes: Math.floor(((ms % day) % hour) / minute),
    seconds: Math.floor((((ms % day) % hour) % minute) / second),
  };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimer({ days, hours, minutes, seconds }) {
  document.querySelector('[data-days]').textContent = addLeadingZero(days);
  document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
  document.querySelector('[data-minutes]').textContent =
    addLeadingZero(minutes);
  document.querySelector('[data-seconds]').textContent =
    addLeadingZero(seconds);
}
