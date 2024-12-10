const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

// Timer settings
const workTime = 25 * 60; // 25 minutes for work (in seconds)
const breakTime = 5 * 60; // 5 minutes for break (in seconds)

let currentTime = workTime; // Starting with work time
let isTimerActive = false;
let interval;
let isBreak = false; // Track whether the user is on a break

// Elements
const timerDisplay = document.getElementById("timer-display");
const startButton = document.getElementById("start-timer");
const resetButton = document.getElementById("reset-timer");
const activeTaskName = document.getElementById("active-task"); // Focus on task element

// Start or stop the Pomodoro timer
function startPomodoro() {
    if (isTimerActive) {
        clearInterval(interval);
        isTimerActive = false;
        startButton.textContent = "Start Timer";
    } else {
        isTimerActive = true;
        startButton.textContent = "Pause Timer";
        interval = setInterval(updateTimer, 1000); // Start the timer
    }
}

// Update timer every second
function updateTimer() {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    timerDisplay.textContent = `${formatTime(minutes)}:${formatTime(seconds)}`;

    if (currentTime === 0) {
        clearInterval(interval);
        isTimerActive = false;
        if (isBreak) {
            alert("Break time is over! Time to focus again.");
            currentTime = workTime; // Reset to work time after break
        } else {
            alert("Time to take a break!");
            currentTime = breakTime; // Reset to break time after work
        }
        isBreak = !isBreak; // Switch between work and break
        startButton.textContent = "Start Timer";
    } else {
        currentTime--;
    }
}

// Format time to always show two digits
function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

// Reset the timer
function resetTimer() {
    clearInterval(interval);
    isTimerActive = false;
    startButton.textContent = "Start Timer";
    currentTime = isBreak ? breakTime : workTime;
    timerDisplay.textContent = `${formatTime(Math.floor(currentTime / 60))}:${formatTime(currentTime % 60)}`;
}

function addTask() {
    // Check if the input box is empty
    if (inputBox.value === '') {
        alert("You must write something!");
    } else {
        // Create a new list item (li)
        let li = document.createElement("li");

        // Set the text of the list item to the input value
        li.innerHTML = inputBox.value;

        // Append the new list item to the list container
        listContainer.appendChild(li);
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);
    }
    // Clear the input box after adding the task
    inputBox.value = '';
    saveData();
}

listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        // Change the focus task dynamically
        if (e.target.classList.contains("checked")) {
            activeTaskName.textContent = ` ${e.target.textContent.replace('\u00d7', '').trim()}`;
        } else {
            activeTaskName.textContent = " None";
        }
        
        saveData();
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        saveData();
    }
}, false);

function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}
function showTask() {
    listContainer.innerHTML = localStorage.getItem("data");
}
showTask();

// Function to get and display the current day
function displayDay() {
    const dayDisplay = document.getElementById('day-display');
    const today = new Date();

    // Array of days in a week
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Get the current day of the week
    const currentDay = daysOfWeek[today.getDay()];

    // Set the current day in the day-display div
    const dayText = document.getElementById('day-text');
    dayText.textContent = `Today is ${currentDay}`;
}

// Call the function to display the current day when the page loads
displayDay();
