const { invoke } = window.__TAURI__.tauri

const name = document.getElementById("name");
const lat = document.getElementById("lat");
const lon = document.getElementById("lon");
const alt = document.getElementById("alt");
const year = document.getElementById("year");
const next = document.getElementById("next");
let id = 0;

async function fill() {
    await invoke("get_alt", {id})
    .then((message) => {
        alt.textContent = message;
    })
    await invoke("get_sat_lat", {id})
    .then((message) => {
        lat.textContent = message;
    })
    await invoke("get_sat_lon", {id})
    .then((message) => {
        lon.textContent = message;
    })
  }
  
  window.addEventListener("DOMContentLoaded", () => {
    nextInput = document.querySelector("#next-input");
    document.querySelector("#next-form").addEventListener("submit", (e) => {
      e.preventDefault();
      next();
    });
  });
  
  
  