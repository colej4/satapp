const { invoke } = window.__TAURI__.tauri

let listenIdInput;
let listenFreqInput;


async function listen() {
  await invoke("listen", {id: listenIdInput.value, freq: listenFreqInput.value})
    .then((message) => console.log(message))
    .catch((error) => console.error(error))
}

window.addEventListener("DOMContentLoaded", () => {
  listenIdInput = document.querySelector("#listen-id-input");
  listenFreqInput = document.querySelector("#listen-freq-input");
  document.querySelector("#listen-form").addEventListener("submit", (e) => {
    e.preventDefault();
    listen();
  });
});
