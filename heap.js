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

// Code Snippets for Heap Sort in C, C++, and Java
const codeSnippets = {
    Cpp: [
        "void heapify(vector<int>& arr, int n, int i) {",
        "    int largest = i;",
        "    int left = 2 * i + 1;",
        "    int right = 2 * i + 2;",
        "    if (left < n && arr[left] > arr[largest]) {",
        "        largest = left;",
        "    }",
        "    if (right < n && arr[right] > arr[largest]) {",
        "        largest = right;",
        "    }",
        "    if (largest != i) {",
        "        swap(arr[i], arr[largest]);",
        "        heapify(arr, n, largest);",
        "    }",
        "}",
        "void heapSort(vector<int>& arr) {",
        "    int n = arr.size();",
        "    for (int i = n / 2 - 1; i >= 0; i--) {",
        "        heapify(arr, n, i);",
        "    }",
        "    for (int i = n - 1; i >= 0; i--) {",
        "        swap(arr[0], arr[i]);",
        "        heapify(arr, i, 0);",
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

async function heapify(n, i) {
    const bars = document.querySelectorAll(".bar");
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    highlightCodeLine([1, 2, 3]); // Highlight heapify comparison

    if (left < n && array[left] > array[largest]) {
        largest = left;
    }

    if (right < n && array[right] > array[largest]) {
        largest = right;
    }

    if (largest !== i) {
        [array[i], array[largest]] = [array[largest], array[i]];

        bars[i].style.height = `${array[i] * 3}px`;
        bars[largest].style.height = `${array[largest] * 3}px`;
        bars[i].querySelector("span").textContent = array[i];
        bars[largest].querySelector("span").textContent = array[largest];
        playSound(swapSound);

        await waitIfPaused();
        await new Promise(resolve => setTimeout(resolve, delay));
        highlightCodeLine([7]); // Highlight heapify swap

        await heapify(n, largest);
    }
}

async function heapSort() {
    if (isSorting) return; // Prevent multiple simultaneous sorts
    isSorting = true;
    pauseResumeButton.disabled = false; // Enable Pause button

    const bars = document.querySelectorAll(".bar");
    const n = array.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(n, i);
    }

    for (let i = n - 1; i > 0; i--) {
        [array[0], array[i]] = [array[i], array[0]];

        bars[0].style.height = `${array[0] * 3}px`;
        bars[i].style.height = `${array[i] * 3}px`;
        bars[0].querySelector("span").textContent = array[0];
        bars[i].querySelector("span").textContent = array[i];
        playSound(swapSound);

        await waitIfPaused();
        await new Promise(resolve => setTimeout(resolve, delay));

        await heapify(i, 0);

        // Highlight the sorted element in red
        bars[i].style.backgroundColor = 'red'; 
    }

    loopIndicator.textContent = "Array is sorted!";
    highlightCodeLine(16); // Highlight end of function
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
startSortButton.addEventListener("click", () => heapSort());
themeToggleButton.addEventListener("click", toggleTheme);
pauseResumeButton.addEventListener("click", togglePause);
languageSelector.addEventListener("change", (e) => changeLanguage(e.target.value));

// Initialize
generateRandomArray(30);
highlightCodeLine(-1);
pauseResumeButton.disabled = true; // Disable Pause button initially
