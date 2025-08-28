// Sidebar toggle logic
const icon = document.querySelector('.icon');
const sidebar = document.getElementById('sidebar');
const closeSidebarBtn = document.getElementById('close-sidebar');

// Toggle sidebar when the icon is clicked
icon.addEventListener('click', function() {
    sidebar.classList.toggle('active'); // Toggle sidebar visibility
});

// Close sidebar when the close button is clicked
closeSidebarBtn.addEventListener('click', function() {
    sidebar.classList.remove('active'); // Hide the sidebar
});

// Redirection logic for sorting algorithms
function openVisualizer(algorithm) {
    switch (algorithm) {
        case 'mergeSort':
            window.location.href = 'merge.html'; // Redirect to the Merge Sort visualizer
            break;
        case 'bubbleSort':
            window.location.href = 'bubble.html'; // Redirect to the Bubble Sort visualizer
            break;
        case 'selectionSort':
            window.location.href = 'selection.html'; // Redirect to the Selection Sort visualizer
            break;
        case 'insertionSort':
            window.location.href = 'insertion.html'; // Redirect to the Insertion Sort visualizer
            break;
        case 'quickSort':
            window.location.href = 'quick.html'; // Redirect to the Quick Sort visualizer
            break;
        case 'heapSort':
            window.location.href = 'heap.html'; // Redirect to the Heap Sort visualizer
            break;
        case 'Searching':
            window.location.href = 'searching.html'; // Redirect to the Heap Sort visualizer
            break;
        
        default:
            console.log('Algorithm not found');
    }
}

// Sidebar toggle using button
document.getElementById('toggle-sidebar').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    sidebar.style.display = sidebar.style.display === 'block' ? 'none' : 'block';
});

// Close sidebar
closeSidebarBtn.addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    sidebar.style.display = 'none';
});

// Add event listeners for sorting algorithm items
document.getElementById('merge-sort').addEventListener('click', function() {
    openVisualizer('mergeSort'); // Redirect to Merge Sort visualizer
});

document.getElementById('bubble-sort').addEventListener('click', function() {
    openVisualizer('bubbleSort'); // Redirect to Bubble Sort visualizer
});

document.getElementById('selection-sort').addEventListener('click', function() {
    openVisualizer('selectionSort'); // Redirect to Selection Sort visualizer
});

document.getElementById('insertion-sort').addEventListener('click', function() {
    openVisualizer('insertionSort'); // Redirect to Insertion Sort visualizer
});

document.getElementById('quick-sort').addEventListener('click', function() {
    openVisualizer('quickSort'); // Redirect to Quick Sort visualizer
});

document.getElementById('heap-sort').addEventListener('click', function() {
    openVisualizer('heapSort'); // Redirect to Heap Sort visualizer
});

document.getElementById('search').addEventListener('click', function() {
    openVisualizer('Searching'); // Corrected: Redirect to Searching visualizer
});

