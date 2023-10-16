const { invoke } = window.__TAURI__.tauri
const { WebviewWindow } = window.__TAURI__.window;
const { emit, listen } = window.__TAURI__.event;
const canvas = document.getElementById("map-canvas");
const context = canvas.getContext("2d");
const rect = canvas.getBoundingClientRect();
let sats = [];
let selected = 100000;




// Initial zoom and pan values
let zoom = 0.5;
let panX = 0;
let panY = 0;
setInterval(updateSats, 1000);
setInterval(draw, 1000);

function draw() {

    // Initial canvas size
    canvas.width = window.innerWidth - 150;
    canvas.height = window.innerHeight - 50;

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate scaled image dimensions based on zoom
    const scaledWidth = image.width * zoom;
    const scaledHeight = image.height * zoom;

    // Calculate position to draw the image
    const drawX = canvas.width / 2 - scaledWidth / 2 + panX;
    const drawY = canvas.height / 2 - scaledHeight / 2 + panY;

    // Clip rendering to the canvas boundaries
    context.save();
    context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height);
    context.clip();
    context.fillStyle = "white";
    // Draw the image
    context.drawImage(image, drawX, drawY, scaledWidth, scaledHeight);
    context.globalAlpha = 0.75;
    sats.forEach(item => {
        let centerx = drawX + zoom * item[0];
        let centery = drawY + zoom * item[1]
        if (item[2] == selected) {
            context.fillStyle = "red";
            context.fillRect(centerx - 2, centery - 2, 4, 4);
            context.fillStyle = "white";
        } else {
            context.fillRect(centerx - 2, centery - 2, 4, 4);
        }

    })


    // Restore clipping
    context.restore();
}

async function updateSats() {
    await invoke("get_all_sat_x_y").then((message) => {
        sats = message;
    })
}

const image = new Image();
image.src = "assets/earth.jpg"
// Call the draw function initially
image.onload = () => {
    draw();
}


// Event listeners for zoom and pan
window.addEventListener("wheel", (event) => {
    // Change the zoom level based on the scroll direction
    if (event.deltaY > 0) {
        zoom = zoom * 0.9
    } else {
        zoom = zoom * 1.1
    }
    zoom = Math.max(0.1, zoom); // Limit zoom level
    draw();
    event.preventDefault();
});

let isDragging = false;
let mouseDown = false;
let startPanX, startPanY;

canvas.addEventListener("mousedown", (event) => {
    mouseDown = true;
});

canvas.addEventListener("mousemove", (event) => {
    if (!mouseDown) {
        startPanX = panX - event.clientX;
        startPanY = panY - event.clientY;
    }
    const distanceX = Math.abs((panX - event.clientX) - startPanX);
    const distanceY = Math.abs((panY - event.clientY) - startPanY);
    if (distanceX > 10 || distanceY > 10) {
        isDragging = true;
    }
    if (isDragging) {
        panX = event.clientX + startPanX;
        panY = event.clientY + startPanY;
    }
    draw();
});

window.addEventListener("mouseup", (event) => {
    if (!isDragging && ((event.clientX < 110 || event.clientX > 340) || (event.clientY < 25 || event.clientY > 154))) {
        onclick(event)
    }
    console.log("click at (" + event.clientX + ", " + event.clientY + ")");
    isDragging = false;
    mouseDown = false;
});

function onclick(event) {
    // create a new worker thread
    worker = new Worker("nearest.js")
    // pass data to worker thread
    worker.postMessage([getCursorPosMap(event)[0], getCursorPosMap(event)[1], sats])
    // listen to any data passed from worker thread
    worker.addEventListener("message", event => {
        if (event.data) {
            console.log(event.data);
            selected = event.data;
            findInput.value = selected;
        }
    })
}

function getCursorPosMap(event) {

    // Calculate scaled image dimensions based on zoom
    const scaledWidth = image.width * zoom;
    const scaledHeight = image.height * zoom;

    // Calculate position to draw the image
    const drawX = canvas.width / 2 - scaledWidth / 2 + panX;
    const drawY = canvas.height / 2 - scaledHeight / 2 + panY;

    return [(event.clientX - rect.left - drawX) / zoom, (event.clientY - rect.top - drawY) / zoom];
}

function select() {
    const webview = new WebviewWindow('popup', {
        "width": 560,
        "height": 220,
        "url": "popup.html",
        "label": "popup",
        "title": "Info for selected satellite",
        "resizable": false,
        "alwaysOnTop": true
        
        
    });
    selected = findInput.value;
    console.log("emitting selected", selected);
    
}

window.addEventListener("mouseup", (event) => {
    isDragging = false;
});
window.addEventListener("DOMContentLoaded", () => {
    findInput = document.querySelector("#map-input");
    document.querySelector("#map-form").addEventListener("submit", (e) => {
        e.preventDefault();
        select();
        emit('selected', {
            id: selected,
        })
    });
});

async function handleNeedSelected() {
    await listen('needselected', (event) => {
        emit('selected', {
            id: selected,
        })
    });
}

handleNeedSelected();


const zoomInButton = document.getElementById("zoom-in-button");
const zoomOutButton = document.getElementById("zoom-out-button");

zoomInButton.addEventListener("click", () => {
    zoom *= 1.2;
});

zoomOutButton.addEventListener("click", () => {
    zoom *= 0.8;
});

