const arrayContainer = document.getElementById("array-container");
const generateArrayButton = document.getElementById("generate-array");
const startSortButton = document.getElementById("start-sort");
const speedRange = document.getElementById("speed-range");
const sizeRange = document.getElementById("size-range");
const setArrayButton = document.getElementById("set-array");
const customArrayInput = document.getElementById("custom-array");
const themeToggleButton = document.getElementById("theme-toggle");
const algorithmCode = document.getElementById("algorithm-code");
const loopIndicator = document.getElementById("loop-indicator");
const pauseResumeButton = document.getElementById("pause-resume");
const languageSelector = document.getElementById("language-selector");

let array = [];
let delay = parseInt(speedRange.value);
let isPaused = false; // Tracks pause state
let isSorting = false; // Tracks whether sorting is in progress

// Audio setup
const comparisonSound = new Audio("https://freesound.org/data/previews/151/151022_2437354-lq.mp3");
const swapSound = new Audio("https://freesound.org/data/previews/131/131657_2398406-lq.mp3");

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

// Code Snippets for Bubble Sort in C, C++, and Java
const codeSnippets = {
    Cpp: [
        "void bubbleSort(vector<int>& arr) {",
        "    int n = arr.size();",
        "    for (int i = 0; i < n-1; i++) {",
        "        for (int j = 0; j < n-i-1; j++) {",
        "            if (arr[j] > arr[j+1]) {",
        "                swap(arr[j], arr[j+1]);",
        "            }",
        "        }",
        "    }",
        "}"
    ],
};

// Current language selected
let currentLanguage = "Cpp";

function highlightCodeLine(indices) {
    if (!Array.isArray(indices)) indices = [indices];
    const highlightedCode = codeSnippets[currentLanguage]
        .map((line, i) => 
            indices.includes(i) ? `<span class="highlight">${line}</span>` : line
        )
        .join("\n");
    algorithmCode.innerHTML = highlightedCode;
}

// Generate Random Array
function generateRandomArray(size = 30) {
    arrayContainer.innerHTML = '';
    array = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    array.forEach(value => {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${value * 3}px`;
        bar.style.width = `${100 / size}%`;
        const number = document.createElement("span");
        number.textContent = value; // Set the number to the bar value
        bar.appendChild(number); // Append the number inside the bar
        arrayContainer.appendChild(bar);
    });
    highlightCodeLine(-1); // Reset code highlighting
}

// Custom Array Input
function setCustomArray(input) {
    const customValues = input.split(',').map(num => parseInt(num.trim())).filter(Boolean);
    if (customValues.length) {
        array = customValues;
        generateCustomArray();
    }
}

function generateCustomArray() {
    arrayContainer.innerHTML = '';
    array.forEach(value => {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${value * 3}px`;
        bar.style.width = `${100 / array.length}%`;
        const number = document.createElement("span");
        number.textContent = value; // Set the number to the bar value
        bar.appendChild(number); // Append the number inside the bar
        arrayContainer.appendChild(bar);
    });
    highlightCodeLine(-1); // Reset code highlighting
}

// Pause/Resume Functionality
function togglePause() {
    if (!isSorting) return; // Prevent pausing if not sorting
    isPaused = !isPaused;
    pauseResumeButton.textContent = isPaused ? "Resume" : "Pause";
}

// Helper function to handle pause
async function waitIfPaused() {
    while (isPaused) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

async function bubbleSort() {
    if (isSorting) return; // Prevent multiple simultaneous sorts
    isSorting = true;
    pauseResumeButton.disabled = false; // Enable Pause button

    const bars = document.querySelectorAll(".bar");
    for (let i = 0; i < array.length; i++) {
        highlightCodeLine(2); // Highlight outer loop (start of function)
        await waitIfPaused(); // Check pause state
        await new Promise(resolve => setTimeout(resolve, delay));

        for (let j = 0; j < array.length - i - 1; j++) {
            highlightCodeLine(3); // Highlight inner loop
            await waitIfPaused(); // Check pause state
            await new Promise(resolve => setTimeout(resolve, delay));

            loopIndicator.textContent = `Comparing index ${j} and ${j + 1}`;
            bars[j].classList.add("active");
            bars[j + 1].classList.add("active");
            playSound(comparisonSound);

            if (array[j] > array[j + 1]) {
                highlightCodeLine([5, 6]); // Highlight swap lines together
                await waitIfPaused(); // Check pause state

                // Swap values in array
                [array[j], array[j + 1]] = [array[j + 1], array[j]];

                // Update bar heights and numbers
                bars[j].style.height = `${array[j] * 3}px`;
                bars[j + 1].style.height = `${array[j + 1] * 3}px`;
                bars[j].querySelector("span").textContent = array[j];
                bars[j + 1].querySelector("span").textContent = array[j + 1];

                playSound(swapSound);
            }

            await new Promise(resolve => setTimeout(resolve, delay));
            bars[j].classList.remove("active");
            bars[j + 1].classList.remove("active");
        }

        bars[array.length - i - 1].classList.add("sorted");
        highlightCodeLine(7); // Highlight end of inner loop
    }
    loopIndicator.textContent = "Array is sorted!";
    highlightCodeLine(8); // Highlight end of function
    isSorting = false;
    pauseResumeButton.disabled = true; // Disable Pause button after sorting
}

// Theme Toggle (Dark Mode)
function toggleTheme() {
    document.body.classList.toggle("dark-mode"); // Toggle dark mode
    themeToggleButton.style.display = "block"; // Show the button when in dark mode
}

// Language Selector
function changeLanguage(language) {
    currentLanguage = language;
    highlightCodeLine(-1); // Reset code highlighting when language changes
}

// Event Listeners
generateArrayButton.addEventListener("click", () => generateRandomArray(parseInt(sizeRange.value)));
sizeRange.addEventListener("input", () => generateRandomArray(parseInt(sizeRange.value)));
speedRange.addEventListener("input", () => delay = parseInt(speedRange.value));
setArrayButton.addEventListener("click", () => setCustomArray(customArrayInput.value));
startSortButton.addEventListener("click", bubbleSort);
themeToggleButton.addEventListener("click", toggleTheme);
pauseResumeButton.addEventListener("click", togglePause);
languageSelector.addEventListener("change", (e) => changeLanguage(e.target.value));

// Initialize
generateRandomArray(30);
highlightCodeLine(-1);
pauseResumeButton.disabled = true; // Disable Pause button initially
