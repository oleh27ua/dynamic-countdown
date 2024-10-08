// Define constants for time calculations
const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

// Define the target day and time (can be changed to any day of the week and time in 24h format)
let TARGET_DAY = "Saturday";
let TARGET_TIME = "00:00"; // 24-hour format (HH:MM)
let TARGET_DATE = null;
let IS_REPETITIVE = true;

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function formatDate(date) {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday && !IS_REPETITIVE) {
        return 'Today';
    }
    
    return daysOfWeek[date.getDay()];
}

// Function to calculate the next occurrence of the target day at the specified time
function getNextTargetDayAndTime() {
    const now = new Date();
    let targetDate;

    if (TARGET_DATE) {
        targetDate = new Date(TARGET_DATE);
    } else {
        const targetDayIndex = daysOfWeek.indexOf(TARGET_DAY);
        const currentDayIndex = now.getDay();
        let daysUntilTarget = (targetDayIndex - currentDayIndex + 7) % 7;
        
        targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilTarget);
    }

    const [targetHours, targetMinutes] = TARGET_TIME.split(':').map(Number);
    targetDate.setHours(targetHours, targetMinutes, 0, 0);

    // If the target time has already passed today, move to the next occurrence
    if (targetDate <= now) {
        if (IS_REPETITIVE) {
            // For repetitive, move to the next week
            targetDate.setDate(targetDate.getDate() + 7);
        } else if (TARGET_DATE) {
            // For non-repetitive with a specific date, keep the date as is (it will be in the past)
        } else {
            // For non-repetitive without a specific date, move to the next occurrence of the day
            targetDate.setDate(targetDate.getDate() + 7);
        }
    }

    return targetDate.getTime();
}

// Function to calculate time remaining
function getTimeRemaining(endTime) {
    const now = new Date().getTime();
    const timeLeft = endTime - now;

    return {
        total: timeLeft,
        days: Math.floor(timeLeft / DAY),
        hours: Math.floor((timeLeft % DAY) / HOUR),
        minutes: Math.floor((timeLeft % HOUR) / MINUTE),
        seconds: Math.floor((timeLeft % MINUTE) / SECOND)
    };
}

// Function to update the DOM
function updateCountdown() {
    let time = getTimeRemaining(targetDate);

    if (time.total <= 0) {
        // Display "Countdown finished!" in both cases (repetitive or non-repetitive)
        clearInterval(countdownInterval);
        document.getElementById("countdown-title").innerHTML = "Countdown finished";
    
        // Show the "Countdown finished" message for 3 seconds
        setTimeout(() => {
            // Restore the original "TIME LEFT" after 3 seconds
            document.getElementById("countdown-title").innerHTML = "TIME LEFT";
    
            if (IS_REPETITIVE) {
                // If repetitive, restart the countdown
                targetDate = getNextTargetDayAndTime();
                countdownInterval = setInterval(updateCountdown, 1000);
                updateCountdown();
            }
        }, 3000);
    
        // Return early to prevent updating the countdown further after reaching zero
        return;
    }

    const targetDateObj = new Date(targetDate);
    const dateString = formatDate(targetDateObj);
    document.getElementById("frequency").innerText = IS_REPETITIVE ? "Every" : "Until";
    document.getElementById("day-date").innerText = dateString;
    document.getElementById("time").innerText = TARGET_TIME;

    document.getElementById("days").innerText = time.days;
    document.getElementById("hours").innerText = String(time.hours).padStart(2, '0');
    document.getElementById("minutes").innerText = String(time.minutes).padStart(2, '0');
    document.getElementById("seconds").innerText = String(time.seconds).padStart(2, '0');
}

// Function to add event listeners to the spans
function addEventListeners() {
    document.getElementById("frequency").addEventListener("click", openFrequencyModal);
    document.getElementById("day-date").addEventListener("click", openDateModal);
    document.getElementById("time").addEventListener("click", openTimeModal);
}

// Initially set targetDate to next occurrence of the target day at the target time
let targetDate = getNextTargetDayAndTime();

// Run the countdown every second using setInterval
let countdownInterval = setInterval(updateCountdown, 1000);

// Initial update to avoid 1 second delay in rendering
updateCountdown();

// Add event listeners initially
addEventListeners();

// Modal functionality
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-inner-content");
const closeBtn = document.getElementsByClassName("close")[0];

function openModal(content) {
    modalContent.innerHTML = content;
    modal.style.display = "block";
    modal.classList.remove("show");
    void modal.offsetWidth; // Trigger a reflow
    modal.classList.add("show");
}

function closeModal() {
    modal.classList.remove("show");
    setTimeout(() => {
        modal.style.display = "none";
    }, 300);
}

closeBtn.onclick = closeModal;

window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

// Frequency selection
function openFrequencyModal() {
    const content = `
        <h2>Select Frequency</h2>
        <button onclick="setFrequency('every')">Every</button>
        <button onclick="setFrequency('until')">Until</button>
    `;
    openModal(content);
}

function setFrequency(freq) {
    IS_REPETITIVE = (freq === 'every');
    closeModal();
    targetDate = getNextTargetDayAndTime();
    clearInterval(countdownInterval);
    countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();
}

// Date selection
function openDateModal() {
    const today = new Date().toISOString().split('T')[0];
    const content = `
        <h2>Select Date</h2>
        <input type="date" id="date-picker" min="${today}">
        <button onclick="setDate()">Set Date</button>
    `;
    openModal(content);
}

function setDate() {
    const datePicker = document.getElementById("date-picker");
    if (datePicker.value) {
        TARGET_DATE = datePicker.value;
        const selectedDate = new Date(TARGET_DATE);
        TARGET_DAY = daysOfWeek[selectedDate.getDay()];
        closeModal();
        targetDate = getNextTargetDayAndTime();
        clearInterval(countdownInterval);
        countdownInterval = setInterval(updateCountdown, 1000);
        updateCountdown();
    }
}

// Time selection
function openTimeModal() {
    const content = `
        <h2>Select Time</h2>
        <input type="time" id="time-picker">
        <button onclick="setTime()">Set Time</button>
    `;
    openModal(content);
}

function setTime() {
    const timePicker = document.getElementById("time-picker");
    if (timePicker.value) {
        TARGET_TIME = timePicker.value;
        closeModal();
        targetDate = getNextTargetDayAndTime();
        clearInterval(countdownInterval);
        countdownInterval = setInterval(updateCountdown, 1000);
        updateCountdown();
    }
}