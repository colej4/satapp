const { invoke } = window.__TAURI__.tauri
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, (window.innerWidth - 120) / (window.innerHeight - 30), 0.1, 10000000 );
const loader = new THREE.TextureLoader;
let satCoords = [];
let sats = [];
let satsCreated = false;
let earth;
let selectedSat = 0;
let findInput;
const selectedMaterial = new THREE.MeshBasicMaterial({color: 0xFF0000});
const selectedGeo = new THREE.BoxGeometry(80, 80, 80);

setInterval(updateSats, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth - 120, window.innerHeight - 30 );
let parent = document.body.querySelector(".tabcontent");
parent.appendChild( renderer.domElement );
renderer.domElement.id = 'globeCanvas';

const earthTexture = loader.load('/assets/earth.jpg');
const normalTexture = loader.load('/assets/Earth-normal-8k.jpg', makeEarth, console.log("progess"), error => console.log(error));
function makeEarth() {
    
    const earthmat = new THREE.MeshBasicMaterial( {
        map: earthTexture,
        normalMap: normalTexture,

    } );
    earth = new THREE.Mesh(
        new THREE.SphereGeometry(6369, 32, 32),
        earthmat
    );
    scene.add(earth);
    console.log("done");
}


function createSats() {
  const geometry = new THREE.BoxGeometry(40, 40, 40);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  
  

  for (let i = 0; i < satCoords.length; i++) {
    const sat = new THREE.Mesh(geometry, material);
    sats.push(sat);
    scene.add(sat);
  }
  
}

const controls = new OrbitControls(camera, renderer.domElement);

camera.position.z = 20000;

function animate() {
	requestAnimationFrame( animate );
    
    for (let i = 0; i < satCoords.length; i++) {
        sats[i].position.x = satCoords[i][1];
        sats[i].position.y = satCoords[i][2];
        sats[i].position.z = satCoords[i][0];
        
        if (satCoords[i][3] == selectedSat) {
            console.log("changing material of " + satCoords[i][3]);
            sats[i].material = selectedMaterial;
            sats[i].geometry = selectedGeo;
        }
      }
    invoke("calc_gmst_now").then((message) => {
        earth.rotation.y = - (message / 86400.0 * 2 * Math.PI) + Math.PI;
    })
	renderer.render( scene, camera );
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

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = (window.innerWidth - 120) / (window.innerHeight - 30);
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth - 120, window.innerHeight - 30);

}

function select() {
    selectedSat = findInput.value;
  }
  
 window.addEventListener("DOMContentLoaded", () => {
  findInput = document.querySelector("#threed-input");
  document.querySelector("#threed-form").addEventListener("submit", (e) => {
    e.preventDefault();
    select();
  });
});
  