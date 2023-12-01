const { invoke } = window.__TAURI__.tauri
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const { WebviewWindow } = window.__TAURI__.window;

let webview;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, (window.innerWidth - 120) / (window.innerHeight - 30), 0.1, 10000000);
const loader = new THREE.TextureLoader;
let satCoords = [];
let sats = [];
let satsCreated = false;
let earth;
let selectedSat;
let findInput;
const defaultMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
const selectedMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
const selectedGeo = new THREE.BoxGeometry(80, 80, 80);

setInterval(updateSats, 500);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth - 120, window.innerHeight - 30);
let parent = document.body.querySelector(".tabcontent");
parent.appendChild(renderer.domElement);
renderer.domElement.id = 'globeCanvas';

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const earthTexture = loader.load('/assets/earth.jpg');
const normalTexture = loader.load('/assets/Earth-normal-8k.jpg', makeEarth, console.log("progess"), error => console.log(error));
function makeEarth() {

    const earthmat = new THREE.MeshBasicMaterial({
        map: earthTexture,
        normalMap: normalTexture,

    });
    earth = new THREE.Mesh(
        new THREE.SphereGeometry(6369, 32, 32),
        earthmat
    );
    scene.add(earth);
    console.log("done");
}


function createSats() {
    const geometry = new THREE.BoxGeometry(100, 100, 100);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });



    for (let i = 0; i < satCoords.length; i++) {
        const sat = new THREE.Mesh(geometry, material);
        sat.userData.id = satCoords[i][3];
        sats.push(sat);
        scene.add(sat);
    }

}

const controls = new OrbitControls(camera, renderer.domElement);
controls.rotateSpeed = 0.2;

camera.position.z = 20000;

function animate() {
    





    requestAnimationFrame(animate);

    for (let i = 0; i < satCoords.length; i++) {
        sats[i].position.x = satCoords[i][1];
        sats[i].position.y = satCoords[i][2]; //for sure positive
        sats[i].position.z = satCoords[i][0];

        if (satCoords[i][3] == selectedSat) {
            sats[i].material = selectedMaterial;
            sats[i].geometry = selectedGeo;
        } else {
            sats[i].material = defaultMaterial;
        }
    }
    invoke("calc_gmst_now").then((message) => {
        earth.rotation.y = (message / 86400.0 * 2 * Math.PI) - Math.PI / 2;
    })


    renderer.render(scene, camera);
}
animate();

async function updateSats() {
    invoke("get_all_r").then((message) => {
        satCoords = message;
        if (satsCreated == false) {
            createSats();
            satsCreated = true;
        }
    })

}

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {

    camera.aspect = (window.innerWidth - 120) / (window.innerHeight - 30);
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth - 120, window.innerHeight - 30);

}

function select() {
    selectedSat = findInput;
    webview = new WebviewWindow('popup', {
        "width": 560,
        "height": 220,
        "url": "popup.html",
        "label": "popup",
        "title": "Info for selected satellite"
      })
      // since the webview window is created asynchronously,
      // Tauri emits the `tauri://created` and `tauri://error` to notify you of the creation response
      webview.once('tauri://created', function () {
        // webview window successfully created
      })
      webview.once('tauri://error', function (e) {
        // an error occurred during webview window creation
      })
}

window.addEventListener("DOMContentLoaded", () => {
    findInput = document.querySelector("#threed-input");
    document.querySelector("#threed-form").addEventListener("submit", (e) => {
        e.preventDefault();
        select();
    });
});

window.addEventListener('click', (event) => {
    if (webview?.close) {
        webview.close();
    }
    const bounds = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    pointer.y = - ((event.clientY - bounds.top) / bounds.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children);
        
    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object !== earth) { // 💀
            
            selectedSat = intersects[i].object.userData.id;
            findInput = selectedSat;
            select();

            break; // stop after one intersection
        } else {
            selectedSat = null;
            findInput = null;
        }
    }

    if (intersects.length === 0 || intersects[0] == earth) {
        selectedSat = null;
        findInput = null;
    }

})
