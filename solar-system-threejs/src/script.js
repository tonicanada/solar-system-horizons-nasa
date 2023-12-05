import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import planets from "./data/planet_properties.json";
import { dateBlade } from "./menu.js";
import { getPlanetPositionsData, drawOrbits } from "./planetPositions.js";


// SCENE
export const scene = new THREE.Scene();

// Add objects to the scene
const positions = new Float32Array(1 * 3); // Un punto en 3D
const pointGeometry = new THREE.BufferGeometry();
pointGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const sunMaterial = new THREE.PointsMaterial({
  size: 8,
  color: "orange",
  sizeAttenuation: false,
});
const sun = new THREE.Points(pointGeometry, sunMaterial);
scene.add(sun);
sun.position.set(0, 0, 0);

const planetMaterial = new THREE.PointsMaterial({
  size: 5,
  color: 0xffffff,
  sizeAttenuation: false,
});

const createPlanet = () => {
  const planetPoints = new THREE.Points(pointGeometry, planetMaterial);
  return planetPoints;
};

const planetNames = Object.keys(planets);
const planetMeshes = {};
for (let planet of planetNames) {
  planetMeshes[planet] = createPlanet(planet);
  scene.add(planetMeshes[planet]);
}

drawOrbits()


// initialize the camera
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  1e12
);

camera.position.z = 1e10;
camera.position.y = 5;

// initialize the renderer
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);

// instantiate the controls
const controls = new OrbitControls(camera, canvas);
controls.enableDampint = true;
controls.autoRotate = true;

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});



const updatePositions = (day) => {
  
  let planetPositions = getPlanetPositionsData(day)
  for (let planet of planetNames) {
    let currentPlanetMesh = planetMeshes[planet];
    if (planetPositions[day]) {
      if (planetPositions[day][planet]) {
        currentPlanetMesh.visible = true;
        currentPlanetMesh.position.x = planetPositions[day][planet][0];
        currentPlanetMesh.position.y = planetPositions[day][planet][1];
        currentPlanetMesh.position.z = planetPositions[day][planet][2];
      } else {
        currentPlanetMesh.visible = false;
      }
    }
  }
};

updatePositions("2023-12-01");

// Añade el evento onchange al slider
dateBlade.on("change", (event) => {
  const newValue = event.value.split(" ")[0];
  // Realiza las acciones que desees con el nuevo valor
  updatePositions(newValue);
});

// RENDERLOOP
// render the scene
const renderloop = () => {
  // controls.update();
  const sunDistance = camera.position.distanceTo(sun.position);
  const sunSize = 5e7 / sunDistance;
  sun.geometry.attributes.position.array[0] = sunSize;
  sun.geometry.attributes.position.needsUpdate = true;

  for (let planet of planetNames) {
    let currentPlanetMesh = planetMeshes[planet];

    const distance = camera.position.distanceTo(currentPlanetMesh.position);
    const pointSize = 5e7 / distance;
    currentPlanetMesh.geometry.attributes.position.array[0] = pointSize;
    currentPlanetMesh.geometry.attributes.position.needsUpdate = true;

  }

  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

renderloop();
