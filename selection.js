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

// Code Snippets for Selection Sort in C, C++, and Java
const codeSnippets = {
    Cpp: [
        "void selectionSort(vector<int>& arr) {",
        "    int n = arr.size();",
        "    for (int i = 0; i < n - 1; i++) {",
        "        int minIndex = i;",
        "        for (int j = i + 1; j < n; j++) {",
        "            if (arr[j] < arr[minIndex]) {",
        "                minIndex = j;",
        "            }",
        "        }",
        "        swap(arr[i], arr[minIndex]);",
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

async function selectionSort() {
    if (isSorting) return; // Prevent multiple simultaneous sorts
    isSorting = true;
    pauseResumeButton.disabled = false; // Enable Pause button

    const bars = document.querySelectorAll(".bar");
    for (let i = 0; i < array.length - 1; i++) {
        highlightCodeLine(2); // Highlight outer loop (start of function)
        await waitIfPaused(); // Check pause state
        await new Promise(resolve => setTimeout(resolve, delay));

        let minIndex = i;

        for (let j = i + 1; j < array.length; j++) {
            highlightCodeLine(4); // Highlight inner loop
            await waitIfPaused(); // Check pause state
            await new Promise(resolve => setTimeout(resolve, delay));

            loopIndicator.textContent = `Comparing index ${i} (value: ${array[i]}) and index ${j} (value: ${array[j]})`;
            bars[j].classList.add("active");
            bars[minIndex].classList.add("active");
            playSound(comparisonSound);

            if (array[j] < array[minIndex]) {
                minIndex = j;
            }

            await new Promise(resolve => setTimeout(resolve, delay));
            bars[j].classList.remove("active");
            bars[minIndex].classList.remove("active");
        }

        // Swap the minimum value with the first element
        if (minIndex !== i) {
            [array[i], array[minIndex]] = [array[minIndex], array[i]]; // Swap in array
            bars[i].style.height = `${array[i] * 3}px`;
            bars[i].querySelector("span").textContent = array[i];

            bars[minIndex].style.height = `${array[minIndex] * 3}px`;
            bars[minIndex].querySelector("span").textContent = array[minIndex];
            playSound(swapSound);
        }

        bars[i].classList.add("sorted"); // Mark as sorted
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    loopIndicator.textContent = "Array is sorted!";
    highlightCodeLine(7); // Highlight end of function
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
startSortButton.addEventListener("click", selectionSort);
themeToggleButton.addEventListener("click", toggleTheme);
pauseResumeButton.addEventListener("click", togglePause);
languageSelector.addEventListener("change", (e) => changeLanguage(e.target.value));

// Initialize
generateRandomArray(30);
highlightCodeLine(-1);
pauseResumeButton.disabled = true; // Disable Pause button initially
