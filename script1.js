// DOM Elements
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const activeTaskName = document.getElementById("active-task"); // Focus element
const timerDisplay = document.getElementById("timer-display");
const startButton = document.getElementById("start-timer");
const resetButton = document.getElementById("reset-timer");

// Timer settings
const workTime = 25 * 60; // 25 minutes for work (in seconds)
const breakTime = 5 * 60; // 5 minutes for break (in seconds)

let currentTime = workTime; // Starting with work time
let isTimerActive = false;
let interval;
let isBreak = false; // Track whether the user is on a break

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

// Add a task to the to-do list
function addTask() {
    if (inputBox.value === '') {
        alert("You must write something!");
    } else {
        const li = document.createElement("li");
        li.innerHTML = inputBox.value;

        // Add event listener to update the "Focus on:" text
        li.addEventListener("click", function () {
            activeTaskName.textContent = li.textContent.replace("\u00d7", "").trim();
        });

        const span = document.createElement("span");
        span.innerHTML = "\u00d7";
        span.addEventListener("click", function () {
            li.remove();
            saveData();
        });

        li.appendChild(span);
        listContainer.appendChild(li);

        inputBox.value = '';
        saveData();
    }
}

// Save tasks to localStorage
function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

// Show saved tasks from localStorage
function showTask() {
    listContainer.innerHTML = localStorage.getItem("data") || '';
    const listItems = listContainer.getElementsByTagName("li");

    for (let item of listItems) {
        item.addEventListener("click", function () {
            activeTaskName.textContent = item.textContent.replace("\u00d7", "").trim();
        });
        const span = item.querySelector("span");
        span.addEventListener("click", function () {
            item.remove();
            saveData();
        });
    }
}

// Display the current day
function displayDay() {
    const dayText = document.getElementById('day-text');
    const today = new Date();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    dayText.textContent = `Today is ${daysOfWeek[today.getDay()]}`;
}

// Initialize the app
showTask();
displayDay();
