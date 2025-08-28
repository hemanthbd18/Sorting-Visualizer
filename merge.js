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

let array = [];
let delay = parseInt(speedRange.value);
let isPaused = false; // Tracks pause state
let isSorting = false; // Tracks whether sorting is in progress

// Audio setup
const comparisonSound = new Audio("https://freesound.org/data/previews/151/151022_2437354-lq.mp3");

// Code Snippet for Merge Sort in C++
const codeSnippets = {
    Cpp: [
        "void mergeSort(vector<int>& arr, int left, int right) {",
        "    if (left >= right) return;",
        "    int mid = left + (right - left) / 2;",
        "    mergeSort(arr, left, mid);",
        "    mergeSort(arr, mid + 1, right);",
        "    merge(arr, left, mid, right);",
        "}",
        "void merge(vector<int>& arr, int left, int mid, int right) {",
        "    vector<int> leftArr(arr.begin() + left, arr.begin() + mid + 1);",
        "    vector<int> rightArr(arr.begin() + mid + 1, arr.begin() + right + 1);",
        "    int i = 0, j = 0, k = left;",
        "    while (i < leftArr.size() && j < rightArr.size()) {",
        "        if (leftArr[i] <= rightArr[j]) arr[k++] = leftArr[i++];",
        "        else arr[k++] = rightArr[j++];",
        "    }",
        "    while (i < leftArr.size()) arr[k++] = leftArr[i++];",
        "    while (j < rightArr.size()) arr[k++] = rightArr[j++];",
        "}"
    ]
};

// Current language selected
let currentLanguage = "Cpp";

// Function to highlight code lines
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

// Merge Sort Implementation
async function mergeSortHandler() {
    if (isSorting) return; // Prevent multiple simultaneous sorts
    isSorting = true;
    pauseResumeButton.disabled = false; // Enable Pause button

    await mergeSort(array, 0, array.length - 1);

    loopIndicator.textContent = "Array is sorted!";
    highlightCodeLine(-1); // Reset highlighting
    isSorting = false;
    pauseResumeButton.disabled = true; // Disable Pause button after sorting
}

// Merge Sort with Visualization
async function mergeSort(arr, left, right) {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);

    // Highlight dividing phase
    colorSubArray(left, right, "blue"); // Blue for division
    highlightCodeLine(1); // Highlight recursive division
    await waitIfPaused();
    await new Promise(resolve => setTimeout(resolve, delay));

    await mergeSort(arr, left, mid);
    await mergeSort(arr, mid + 1, right);

    await merge(arr, left, mid, right);
}

// Merge Function
async function merge(arr, left, mid, right) {
    highlightCodeLine(2); // Highlight merging process
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);

    let i = 0, j = 0, k = left;

    // Highlight merging phase
    colorSubArray(left, right, "red"); // Red for sorting
    await waitIfPaused();

    while (i < leftArr.length && j < rightArr.length) {
        highlightCodeLine(3); // Highlight comparison
        await waitIfPaused();
        await new Promise(resolve => setTimeout(resolve, delay));

        if (leftArr[i] <= rightArr[j]) {
            arr[k++] = leftArr[i++];
        } else {
            arr[k++] = rightArr[j++];
        }

        updateArrayBars(arr);
    }

    while (i < leftArr.length) {
        arr[k++] = leftArr[i++];
        updateArrayBars(arr);
    }

    while (j < rightArr.length) {
        arr[k++] = rightArr[j++];
        updateArrayBars(arr);
    }
}

// Function to color a subarray
function colorSubArray(start, end, color) {
    const bars = document.querySelectorAll(".bar");
    for (let i = start; i <= end; i++) {
        bars[i].style.backgroundColor = color;
    }
}

// Function to update the visualized array
function updateArrayBars(arr) {
    const bars = document.querySelectorAll(".bar");
    arr.forEach((value, idx) => {
        bars[idx].style.height = `${value * 3}px`;
        bars[idx].querySelector("span").textContent = value;
    });
}

// Event Listeners
generateArrayButton.addEventListener("click", () => generateRandomArray(parseInt(sizeRange.value)));
sizeRange.addEventListener("input", () => generateRandomArray(parseInt(sizeRange.value)));
speedRange.addEventListener("input", () => delay = parseInt(speedRange.value));
setArrayButton.addEventListener("click", () => setCustomArray(customArrayInput.value));
startSortButton.addEventListener("click", mergeSortHandler);
pauseResumeButton.addEventListener("click", togglePause);

// Initialize
generateRandomArray(30);
highlightCodeLine(-1);
pauseResumeButton.disabled = true; // Disable Pause button initially
