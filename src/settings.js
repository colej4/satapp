const { invoke } = window.__TAURI__.tauri

let settingsLat;
let settingsLon;


async function write_settings() {
  await invoke("write_settings", { lat: settingsLat.value, lon: settingsLon.value })
    .then((message) => console.log(message))
    .catch((error) => console.error(error))
}

window.addEventListener("DOMContentLoaded", () => {
  settingsLat = document.querySelector("#settings-lat-input");
  settingsLon = document.querySelector("#settings-lon-input");
  document.querySelector("#settings-form").addEventListener("submit", (e) => {
    e.preventDefault();
    write_settings();
  });
});

await invoke("get_lat")
  .then((message) => document.getElementById("settings-lat-input").defaultValue = message.toFixed(5))
  .catch((error) => console.error(error))


await invoke("get_lon")
  .then((message) => document.getElementById("settings-lon-input").defaultValue = message.toFixed(5))
  .catch((error) => console.error(error))

