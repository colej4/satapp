const { invoke } = window.__TAURI__.tauri

let nextInput;

async function next() {
    await invoke("next", {id: nextInput.value})
      .then((message) => {
        const list = document.getElementById("pass-list");
        while (list.firstChild) {
          list.removeChild(list.firstChild);
        }
        message.forEach(item => {
          const listItem = document.createElement("li");
          listItem.textContent = item;
          listItem.className = "list-item";
          list.appendChild(listItem)
        })})
      .catch((error) => console.error(error))
  }
  
  window.addEventListener("DOMContentLoaded", () => {
    nextInput = document.querySelector("#next-input");
    document.querySelector("#next-form").addEventListener("submit", (e) => {
      e.preventDefault();
      next();
    });
  });
  
  
  