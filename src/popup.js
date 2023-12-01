const { invoke } = window.__TAURI__.tauri
const { listen, emit } = window.__TAURI__.event;

const satName = document.getElementById("name");
const lat = document.getElementById("lat");
const lon = document.getElementById("lon");
const alt = document.getElementById("alt");
const year = document.getElementById("year");
const next = document.getElementById("next");
let id = "25544";

emit('needselected');

await listen('selected', (event) => {
  id = event.payload.id.toString();
  console.log("recieved id: " + id);
  fill();
});

async function fill() {
  next.textContent = "Loading...";


  await invoke("get_alt", {id})
  .then((message) => {
    console.log("id is " + id);
    alt.textContent = message.toFixed(2);
  }).catch((error) => alt.textContent = error);
  await invoke("get_sat_lat", {id})
  .then((message) => {
    lat.textContent = message.toFixed(3);
  }).catch((error) => lat.textContent = error);
  await invoke("get_sat_lon", {id})
  .then((message) => {
    lon.textContent = message.toFixed(3);
  }).catch((error) => lon.textContent = error);
  await invoke("get_name", {id}).then((message) => {
    satName.textContent = message;
  }).catch((error) => satName.textContent = error);
  await invoke("get_launch_date", {id}).then((message) => {
    year.textContent = message;
  }).catch((error) => year.textContent = error);
  await invoke("next", {id})
    .then((message) => {
    next.textContent = message[0];
    })
    .catch((error) => next.textContent = error);
  }
  
  
  