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
const swapSound = new Audio("https://freesound.org/data/previews/131/131657_2398406-lq.mp3");

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
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

async function quickSort(low = 0, high = array.length - 1) {
    if (low < high) {
        // Perform partition
        const pivotIndex = await partition(low, high);

        // Recursively sort the left and right subarrays
        await quickSort(low, pivotIndex - 1);
        await quickSort(pivotIndex + 1, high);
    }
}

async function partition(low, high) {
    const bars = document.querySelectorAll(".bar");
    const pivot = array[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        await waitIfPaused(); // Check for pause state

        loopIndicator.textContent = `Comparing index ${j} with pivot ${pivot}`;
        bars[j].classList.add("active");
        bars[high].classList.add("active");

        playSound(comparisonSound);

        if (array[j] <= pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements

            // Update the heights of the bars visually
            bars[i].style.height = `${array[i] * 3}px`;
            bars[j].style.height = `${array[j] * 3}px`;
            bars[i].querySelector("span").textContent = array[i];
            bars[j].querySelector("span").textContent = array[j];

            playSound(swapSound);
        }

        // Delay before the next iteration
        await new Promise(resolve => setTimeout(resolve, delay));

        bars[j].classList.remove("active");
        bars[high].classList.remove("active");
    }

    // Swap pivot to its correct position
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    bars[i + 1].style.height = `${array[i + 1] * 3}px`;
    bars[high].style.height = `${array[high] * 3}px`;
    bars[i + 1].querySelector("span").textContent = array[i + 1];
    bars[high].querySelector("span").textContent = array[high];

    return i + 1; // Return the pivot index
}

// Highlight code for visualization
function highlightCodeLine(indices) {
    if (!Array.isArray(indices)) indices = [indices];
    const codeSnippets = {
        Cpp: [
            "void quickSort(vector<int>& arr, int low, int high) {",
            "    if (low < high) {",
            "        int pivot = partition(arr, low, high);",
            "        quickSort(arr, low, pivot - 1);",
            "        quickSort(arr, pivot + 1, high);",
            "    }",
            "}",
            "int partition(vector<int>& arr, int low, int high) {",
            "    int pivot = arr[high];",
            "    int i = (low - 1);",
            "    for (int j = low; j <= high - 1; j++) {",
            "        if (arr[j] <= pivot) {",
            "            i++;",
            "            swap(arr[i], arr[j]);",
            "        }",
            "    }",
            "    swap(arr[i + 1], arr[high]);",
            "    return (i + 1);",
            "}"
        ]
    };

    const currentLanguage = "Cpp";
    const highlightedCode = codeSnippets[currentLanguage]
        .map((line, i) =>
            indices.includes(i) ? `<span class="highlight">${line}</span>` : line
        )
        .join("\n");

    algorithmCode.innerHTML = highlightedCode;
}

// Theme Toggle (Dark Mode)
function toggleTheme() {
    document.body.classList.toggle("dark-mode"); // Toggle dark mode
}

// Event Listeners
generateArrayButton.addEventListener("click", () => generateRandomArray(parseInt(sizeRange.value)));
sizeRange.addEventListener("input", () => generateRandomArray(parseInt(sizeRange.value)));
speedRange.addEventListener("input", () => delay = parseInt(speedRange.value));
setArrayButton.addEventListener("click", () => setCustomArray(customArrayInput.value));
startSortButton.addEventListener("click", () => {
    if (!isSorting) {
        isSorting = true; // Mark sorting as in progress
        pauseResumeButton.disabled = false; // Enable Pause/Resume button
        quickSort().then(() => {
            isSorting = false;
            pauseResumeButton.disabled = true; // Disable after sorting finishes
            pauseResumeButton.textContent = "Pause";
            isPaused = false;
        });
    }
});
themeToggleButton.addEventListener("click", toggleTheme);
pauseResumeButton.addEventListener("click", togglePause);

// Initialize
generateRandomArray(30);
highlightCodeLine(-1);
pauseResumeButton.disabled = true; // Disable Pause button initially
