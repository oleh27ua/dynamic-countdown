const isLeapYear = (year) => {
    return (
      (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) ||
      (year % 100 === 0 && year % 400 === 0)
    );
  };
  
  const getFebDays = (year) => {
    return isLeapYear(year) ? 29 : 28;
  };
  
  let calendar = document.querySelector('.calendar');
  const month_names = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  let month_picker = document.querySelector('#month-picker');
  const dayTextCurrent = document.querySelector('.day-text-current');
  const timeCurrent = document.querySelector('.time-current');
  const dateCurrent = document.querySelector('.date-current');
  
  // Adding current date and time (your required fragment)
  const now = new Date();
  const today = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
  });
  const time = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
  });
  
  // Displaying the fetched date and time in the UI
  dateCurrent.textContent = today;
  timeCurrent.textContent = time;
  
  month_picker.onclick = () => {
    month_list.classList.remove('hideonce');
    month_list.classList.remove('hide');
    month_list.classList.add('show');
    dayTextCurrent.classList.remove('showtime');
    dayTextCurrent.classList.add('hidetime');
    timeCurrent.classList.remove('showtime');
    timeCurrent.classList.add('hideTime');
    dateCurrent.classList.remove('showtime');
    dateCurrent.classList.add('hideTime');
  };
  
  const generateCalendar = (month, year) => {
    let calendar_days = document.querySelector('.calendar-days');
    calendar_days.innerHTML = '';
    let calendar_header_year = document.querySelector('#year');
    let days_of_month = [
      31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
    ];
  
    let currentDate = new Date();
  
    month_picker.innerHTML = month_names[month];
    calendar_header_year.innerHTML = year;
  
    let first_day = new Date(year, month, 1);
    let startingDay = first_day.getDay();
    startingDay = startingDay === 0 ? 6 : startingDay - 1;
  
    let total_days = days_of_month[month] + startingDay;
    let total_rows = Math.ceil(total_days / 7);
  
    for (let i = 0; i < (total_rows * 7); i++) {
      let day = document.createElement('div');
      
      if (i >= startingDay && i < total_days) {
        day.innerHTML = i - startingDay + 1;
        day.innerHTML = i - startingDay + 1;
        if (i - startingDay + 1 === currentDate.getDate() &&
          year === currentDate.getFullYear() &&
          month === currentDate.getMonth()
        ) {
          day.classList.add('current-date');
        }
      } else if (i < startingDay) {
        let prevMonth = month === 0 ? 11 : month - 1;
        let prevMonthDays = days_of_month[prevMonth];
        day.innerHTML = prevMonthDays - startingDay + i + 1;
        day.classList.add('prev-month-day');
      } else {
        day.innerHTML = i - total_days + 1;
        day.classList.add('next-month-day');
      }
  
      calendar_days.appendChild(day);
    }
  };
  
  
  let month_list = calendar.querySelector('.month-list');
  month_names.forEach((e, index) => {
    let month = document.createElement('div');
    month.innerHTML = `<div>${e}</div>`;
  
    month_list.append(month);
    month.onclick = () => {
        currentMonth.value = index;
        generateCalendar(currentMonth.value, currentYear.value);
        month_list.classList.replace('show', 'hide');
        dayTextCurrent.classList.remove('hideTime');
        dayTextCurrent.classList.add('showtime');
        timeCurrent.classList.remove('hideTime');
        timeCurrent.classList.add('showtime');
        dateCurrent.classList.remove('hideTime');
        dateCurrent.classList.add('showtime');
    };
  });
  
  (function () {
    month_list.classList.add('hideonce');
  })();
  
  document.querySelector('#pre-year').onclick = () => {
    --currentYear.value;
    generateCalendar(currentMonth.value, currentYear.value);
  };
  
  document.querySelector('#next-year').onclick = () => {
    ++currentYear.value;
    generateCalendar(currentMonth.value, currentYear.value);
  };
  
  let currentDate = new Date();
  let currentMonth = { value: currentDate.getMonth() };
  let currentYear = { value: currentDate.getFullYear() };
  generateCalendar(currentMonth.value, currentYear.value);
  
  // Обробка натискань на кнопки місяців
  document.getElementById('prev-month').onclick = () => {
    currentMonth.value = (currentMonth.value === 0) ? 11 : currentMonth.value - 1; // Зменшуємо місяць, циклічно
    if (currentMonth.value === 11) {
        currentYear.value--; // Якщо грудень, зменшуємо рік
    }
    generateCalendar(currentMonth.value, currentYear.value); // Генеруємо календар
  };
  
  document.getElementById('next-month').onclick = () => {
    currentMonth.value = (currentMonth.value === 11) ? 0 : currentMonth.value + 1; // Збільшуємо місяць, циклічно
    if (currentMonth.value === 0) {
        currentYear.value++; // Якщо січень, збільшуємо рік
    }
    generateCalendar(currentMonth.value, currentYear.value); // Генеруємо календар
  };
  
  generateCalendar(currentMonth.value, currentYear.value);
  
  // Додавання динамічного часу
  const todayShowTime = document.querySelector('.time-current');
  setInterval(() => {
    const timer = new Date();
    const currentTimer = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hourCycle: 'h23'
    }).format(timer);
    todayShowTime.textContent = currentTimer;
  }, 1000);
  
  document.addEventListener('DOMContentLoaded', function () {
      // Додаємо обробник подій для кнопки "TODAY"
      const todayButton = document.getElementById('today-button');
      
      todayButton.addEventListener('click', () => {
          const today = new Date();
          currentMonth.value = today.getMonth();
          currentYear.value = today.getFullYear();
          generateCalendar(currentMonth.value, currentYear.value);
      });
  
      // Зберігаємо оригінальні класи
      const originalClasses = todayButton.className;
  
      // Додаємо обробники подій для анімації при наведенні
      todayButton.addEventListener('mouseenter', () => {
          todayButton.className = originalClasses + ' today-button-hover';
      });
  
      todayButton.addEventListener('mouseleave', () => {
          todayButton.className = originalClasses;
      });
  });
  