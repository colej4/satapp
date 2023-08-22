const { invoke } = window.__TAURI__.tauri

let listenIdInput;
let listenFreqInput;
let nextInput;


window.openTab = function(evt, tabName) {
  let i;
  let tabcontent;
  let tablinks;

  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  const selectedTab = document.getElementById(tabName);
  if (selectedTab) {
    selectedTab.style.display = "block";
  }
  evt.currentTarget.className += " active";
};

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


