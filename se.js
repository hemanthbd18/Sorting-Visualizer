const generateArrayBtn = document.getElementById("generate-array");
const elementToSearch = document.getElementById("valueForSearch");
const searchBtn = document.getElementById("search");
const linearSearchBtn = document.getElementById("linear-search");
const binarySearchBtn = document.getElementById("binary-search");
const arrowIcons = document.getElementsByClassName("box-item-icon");

// Colors
const successColor = "#32E0C4";
const failureColor = "#FB3640";

let randomArray = [];
let randomSortedArray = [];
let searchType = "linear";

// Generate random numbers on first load
insertRandomArray();

// Event listener for generating a new array
generateArrayBtn.addEventListener("click", () => {
  insertRandomArray();
  resetUI();
});

// Event listener for searching an element in the array
searchBtn.addEventListener("click", () => {
  let element = elementToSearch.value;
  if (element !== "") {
    const searchValue = parseInt(element);
    disableButtons();

    if (searchType === "linear") {
      linearSearch(randomArray, searchValue);
    } else if (searchType === "binary") {
      binarySearch(randomSortedArray, searchValue, 0, randomSortedArray.length - 1);
    }
  }
});

// Event listeners for selecting the type of search
linearSearchBtn.addEventListener("click", () => {
  binarySearchBtn.style.borderBottomColor = "#243441";
  linearSearchBtn.style.borderBottom = "1px solid white";
  searchType = "linear";
});

binarySearchBtn.addEventListener("click", () => {
  linearSearchBtn.style.borderBottomColor = "#243441";
  binarySearchBtn.style.borderBottom = "1px solid white";

  if (searchType !== "binary") {
    searchType = "binary";
    insertRandomArray();
  }
});

// Linear search function
function linearSearch(arr, value) {
  let counter = 0;

  const timer = setInterval(() => {
    let box = `box-wrapper-${counter}`;

    // Hide previous arrow
    if (counter !== 0) {
      arrowIcons[counter - 1].style.display = "none";
    }

    if (counter >= arr.length) {
      alert("Element Not Found");
      resetUI();
      clearInterval(timer);
    } else {
      // Show current arrow
      arrowIcons[counter].style.display = "block";
      document.getElementById(box).style.backgroundColor = failureColor;

      if (arr[counter] === value) {
        document.getElementById(box).style.backgroundColor = successColor;
        alert("Element Found At Index " + counter);
        resetUI();
        clearInterval(timer);
      }
    }
    counter++;
  }, 1000);
}

// Binary search function
function binarySearch(arr, x, start, end) {
  if (start > end) {
    alert("Element Not Found");
    resetUI();
    return;
  }

  // Find the middle index
  let mid = Math.floor((start + end) / 2);
  let box = `box-wrapper-${mid}`;

  // Display arrow and color
  arrowIcons[mid].style.display = "block";
  const timer = setTimeout(() => {
    document.getElementById(box).style.backgroundColor = failureColor;
  }, 500);

  if (arr[mid] === x) {
    document.getElementById(box).style.backgroundColor = successColor;
    clearTimeout(timer);
    alert("Element Found At Index " + mid);
    resetUI();
    return;
  }

  setTimeout(() => {
    arrowIcons[mid].style.display = "none";

    if (arr[mid] > x) {
      binarySearch(arr, x, start, mid - 1);
    } else {
      binarySearch(arr, x, mid + 1, end);
    }
  }, 1000);
}

// Generate random array
function generateArray() {
  let resultArray = [];
  for (let i = 0; i < 10; i++) {
    resultArray.push(Math.floor(Math.random() * 99));
  }
  return resultArray;
}

// Insert random generated value into boxes
function insertRandomArray() {
  randomArray = generateArray();
  randomSortedArray = [...randomArray].sort((a, b) => a - b);

  for (let i = 0; i < 10; i++) {
    let box = `box${i}`;
    document.getElementById(box).innerHTML =
      searchType === "linear" ? randomArray[i] : randomSortedArray[i];
  }
}

// Disable all buttons
function disableButtons() {
  binarySearchBtn.disabled = true;
  linearSearchBtn.disabled = true;
  searchBtn.disabled = true;
  generateArrayBtn.disabled = true;
}

// Reset UI and enable buttons
function resetUI() {
  for (let i = 0; i < arrowIcons.length; i++) {
    arrowIcons[i].style.display = "none";
    document.getElementById(`box-wrapper-${i}`).style.backgroundColor = "";
  }

  binarySearchBtn.disabled = false;
  linearSearchBtn.disabled = false;
  searchBtn.disabled = false;
  generateArrayBtn.disabled = false;
}
