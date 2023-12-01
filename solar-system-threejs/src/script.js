import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import planets from "./data/planet_properties.json";
import planet_positions from "./data/planet_position.json";
import { generarArrayFechas } from "./utils.js";

// SCENE
const scene = new THREE.Scene();

// TEXTURES

// Add objects to the scene

const positions = new Float32Array(1 * 3); // Un punto en 3D
const pointGeometry = new THREE.BufferGeometry();
pointGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const sunMaterial = new THREE.PointsMaterial({
  size: 10,
  color: "orange",
  sizeAttenuation: false,
});
const sun = new THREE.Points(pointGeometry, sunMaterial);
scene.add(sun);
sun.position.set(0, 0, 0);

const planetMaterial = new THREE.PointsMaterial({
  size: 25000,
  color: 0xffffff,
  sizeAttenuation: false,
});

const startDate = "1985-01-01";
const endDate = "1985-12-31";

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

const dates = generarArrayFechas(startDate, endDate);

// Crear órbitas para cada planeta
const planetOrbits = {};
for (let planet of planetNames) {
  const orbitGeometry = new THREE.BufferGeometry();
  const orbitPositions = new Float32Array(dates.length * 3); // Un punto por cada fecha
  orbitGeometry.setAttribute("position", new THREE.BufferAttribute(orbitPositions, 3));
  const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
  const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
  scene.add(orbit);
  planetOrbits[planet] = { orbit, positions: orbitPositions, index: 0 };
}

// Lights
const ambientLight = new THREE.AmbientLight("white", 0.1);
scene.add(ambientLight);

// initialize the camera
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  1000000000000
);
camera.position.z = 10000000000;
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

console.log(dates.length);

console.log(planetNames);

const renderloop = (index) => {
  if (index < dates.length) {
    const day = dates[index];

    const sunDistance = camera.position.distanceTo(sun.position);
    const sunSize = 50000000 / sunDistance;
    sun.geometry.attributes.position.array[0] = sunSize;
    sun.geometry.attributes.position.needsUpdate = true;

    for (let planet of planetNames) {
      let currentPlanetMesh = planetMeshes[planet];

      const distance = camera.position.distanceTo(currentPlanetMesh.position);
      const pointSize = 25000000000 / distance;
      currentPlanetMesh.position.x = planet_positions[day][planet][0];
      currentPlanetMesh.position.y = planet_positions[day][planet][1];
      currentPlanetMesh.position.z = planet_positions[day][planet][2];
      currentPlanetMesh.material.size = pointSize;

      // Actualizar la posición del planeta
      const planetOrbit = planetOrbits[planet];
      const { positions, index: currentIndex } = planetOrbit;
      positions[currentIndex * 3] = currentPlanetMesh.position.x;
      positions[currentIndex * 3 + 1] = currentPlanetMesh.position.y;
      positions[currentIndex * 3 + 2] = currentPlanetMesh.position.z;
      planetOrbit.orbit.geometry.setDrawRange(0, currentIndex + 1);
      planetOrbit.orbit.geometry.attributes.position.needsUpdate = true;
      planetOrbit.index += 1;
    }
    

    // Renderiza la escena
    renderer.render(scene, camera);
    window.requestAnimationFrame(renderloop);

    // Llama a la función renderloop con el siguiente índice después de 1000 milisegundos (1 segundo)
    setTimeout(() => {
      renderloop(index + 1);
    }, 100);
  }
};

// Comienza la animación con el primer índice
renderloop(0);
