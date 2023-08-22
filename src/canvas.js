const { invoke } = window.__TAURI__.tauri
const canvas = document.getElementById("map-canvas");
const context = canvas.getContext("2d");


// Initial zoom and pan values
let zoom = 1;
let panX = 0;
let panY = 0;
setInterval(drawSats, 1000)

function draw() {

    // Initial canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

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

    // Draw the image
    context.drawImage(image, drawX, drawY, scaledWidth, scaledHeight);
    

    // Restore clipping
    context.restore();
}

async function drawSats() {
     // Calculate scaled image dimensions based on zoom
     const scaledWidth = image.width * zoom;
     const scaledHeight = image.height * zoom;
 
     // Calculate position to draw the image
     const drawX = canvas.width / 2 - scaledWidth / 2 + panX;
     const drawY = canvas.height / 2 - scaledHeight / 2 + panY;
     
    await invoke("get_all_sat_x_y").then((message) => {
        draw();
        message.forEach(item => {
            console.log("working")
            const marker = new Path2D();
            marker.moveTo(drawX + zoom * item[0], drawY + zoom * item[1]);
            marker.lineTo((drawX + zoom * item[0]) - 2 * zoom, (drawY + zoom * item[1]) - 3 * zoom);
            marker.lineTo((drawX + zoom * item[0]) + 2 * zoom, (drawY + zoom * item[1]) - 3 * zoom);
            marker.closePath();
            context.fill(marker);
        })
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
    zoom += event.deltaY * -0.01;
    zoom = Math.max(0.5, zoom); // Limit zoom level
    draw();
    event.preventDefault();
});

let isDragging = false;
let startPanX, startPanY;

canvas.addEventListener("mousedown", (event) => {
    isDragging = true;
    startPanX = panX - event.clientX;
    startPanY = panY - event.clientY;
});

canvas.addEventListener("mousemove", (event) => {
    if (!isDragging) return;
    panX = event.clientX + startPanX;
    panY = event.clientY + startPanY;
    draw();
});

window.addEventListener("mouseup", () => {
    isDragging = false;
    
});