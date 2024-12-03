const n = 20;
const array = [];
let originalArray = []; 
let audioCtx = null;
let comparisonCount = 0; 
let swapCount = 0;      
let sortedIndices = [];  

function generateNumbers() {
    for (let i = 0; i < n; i++) {
        array[i] = Math.random();
    }
    originalArray = [...array]; 
    comparisonCount = 0; 
    swapCount = 0;
    sortedIndices = []; 
    showBars();
    updateCounts();
}

function reset() {
    array.length = 0;
    array.push(...originalArray);
    comparisonCount = 0; 
    swapCount = 0;
    sortedIndices = []; 
    showBars(); 
    updateCounts();
}

function selectionSort() {
    let swaps = selectionSortAlgorithm([...array]);
    animate(swaps, 'purple'); 
}

function bubbleSort() {
    let swaps = bubbleSortAlgorithm([...array]);
    animate(swaps, 'green'); 
}

function insertionSort() {
    let swaps = insertionSortAlgorithm([...array]);
    animate(swaps, 'red'); 
}

function animate(swaps, color) {
    if (swaps.length === 0) {
        showBars(sortedIndices, color);
        updateCounts();
        return;
    }
    const [i, j] = swaps.shift(0);
    [array[i], array[j]] = [array[j], array[i]];
    showBars([i, j], color);
    playNote(200 + array[i] * 500);
    playNote(200 + array[j] * 500);

    setTimeout(function () {
        animate(swaps, color);
    }, 50);
}

function bubbleSortAlgorithm(array) {
    const swaps = [];
    let swapped;
    do {
        swapped = false;
        for (let i = 1; i < array.length; i++) {
            comparisonCount++; 
            if (array[i - 1] > array[i]) {
                swaps.push([i - 1, i]);
                swapped = true;
                swapCount++;
                [array[i - 1], array[i]] = [array[i], array[i - 1]];
            }
        }
    } while (swapped);
    sortedIndices = array.map((_, index) => index); 
    return swaps;
}

function selectionSortAlgorithm(array) {
    const swaps = [];
    for (let i = 0; i < array.length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < array.length; j++) {
            comparisonCount++;
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            swaps.push([i, minIndex]);
            swapCount++;
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
        }
    }
    sortedIndices = array.map((_, index) => index); 
    return swaps;
}

function insertionSortAlgorithm(array) {
    const swaps = [];
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            comparisonCount++;
            swaps.push([j, j + 1]);
            swapCount++;
            array[j + 1] = array[j];
            j--;
        }
        array[j + 1] = key;
    }
    sortedIndices = array.map((_, index) => index); 
    return swaps;
}

function showBars(indices, color) {
    const container = document.getElementById('chart');
    container.innerHTML = "";
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement("div");
        bar.style.height = (array[i] * 100) + "%";
        bar.classList.add("bar");
        bar.innerText = Math.round(array[i] * 100); 
        if (indices && indices.includes(i)) {
            bar.style.backgroundColor = color; 
        } else {
            bar.style.backgroundColor = "#007bff"; 
        }
        container.appendChild(bar);
    }
}

function updateCounts() {
    document.getElementById('comparisonCount').innerText = comparisonCount;
    document.getElementById('swapCount').innerText = swapCount;
}

function playNote(freq) {
    if (audioCtx == null) {
        audioCtx = new (
            AudioContext ||
            webkitAudioContext ||
            window.webkitAudioContext
        )();
    }
    const dur = 0.1;
    const osc = audioCtx.createOscillator();
    osc.frequency.value = freq;
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
    const node = audioCtx.createGain();
    node.gain.value = 0.1;
    node.gain.linearRampToValueAtTime(
        0, audioCtx.currentTime + dur
    );
    osc.connect(node);
    node.connect(audioCtx.destination);
}