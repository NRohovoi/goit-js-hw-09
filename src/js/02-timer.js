import Notiflix from 'notiflix';
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import 'flatpickr/dist/themes/dark.css';

let deltaTime = 0;

const refs = {
    inputEl:document.querySelector('#datetime-picker'),
    startBtn: document.querySelector('button[data-start]'),
    days: document.querySelector('span[data-days]'),
    hours: document.querySelector('span[data-hours]'),
    minutes: document.querySelector('span[data-minutes]'),
    seconds: document.querySelector('span[data-seconds]'),
};

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
    onClose(selectedDates) {
        if (selectedDates[0] <= Date.now()) {            
            refs.startBtn.disabled = false;
      Notiflix.Notify.failure('Please choose a date in the future'); 
      }
  },
};

flatpickr(refs.inputEl, options);
const fp = flatpickr(refs.inputEl, options); 

class Timer {
    constructor({onTime}) {
        this.intervalId = null;
        this.isActive = false;
        this.onTime = onTime;
    }

    startTimer() {
        if (this.isActive) {
            return;
        }

        this.isActive = true;

        this.intervalId = setInterval(() => {
            const currentTime = Date.now();
            let deltaTime = fp.selectedDates[0] - currentTime;
            const time = convertMs(deltaTime);

            this.onTime(time);
            if ((deltaTime <= 1000)) {
                clearInterval(this.intervalId);
                return Notify.success('Time is Up');
        }}, 1000)
    }
}
const timer = new Timer({
    onTime: updateClockTime,
});
    
function updateClockTime({ days, hours, minutes, seconds }) {
    refs.days.textContent = days;
    refs.hours.textContent = hours;
    refs.minutes.textContent = minutes;
    refs.seconds.textContent = seconds;
}

refs.startBtn.addEventListener('click', () => {
    refs.startBtn.disabled = true;
    timer.startTimer();
});


function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = addLeadingZero(Math.floor(ms / day));
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  const seconds = addLeadingZero(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
    return String(value).padStart(2, '0');
};