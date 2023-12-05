import * as THREE from "three";
import { scene } from "./script";
// Import planet positions
import planets from "./data/planet_properties.json";
import planetPositionsBc_2000_0001_10d from "./data/planetPosition/bc/planet_position_2000-0001_10d.json";
import planetPositionsAc_0001_1601_10d from "./data/planetPosition/ac/planet_position_0001-1601_10d.json";
import planetPositionsAc_1602_1701_5d from "./data/planetPosition/ac/planet_position_1602-1701_5d.json";
import planetPositionsAc_1702_1750_5d from "./data/planetPosition/ac/planet_position_1702-1750_5d.json";
import planetPositionsAc_1751_2099_5d from "./data/planetPosition/ac/planet_position_1751-2099_5d.json";



const planetNames = Object.keys(planets);

export const getPlanetPositionsData = (day) => {
  let planetPositions;

  if (day.startsWith("-")) {
    return (planetPositions = planetPositionsBc_2000_0001_10d);
  } else {
    const year = parseInt(day.split("-")[0]);
    if (year >= 0 && year <= 1601) {
      return planetPositionsAc_0001_1601_10d;
    } else if (year > 1601 && year <= 1701) {
      return planetPositionsAc_1602_1701_5d;
    } else if (year > 1702 && year <= 1750) {
      return planetPositionsAc_1702_1750_5d;
    } else if (year > 1750 && year <= 2099) {
      return planetPositionsAc_1751_2099_5d;
    }
  }
};

// Crear órbitas para cada planeta

const createPlanetPositionsObject = (planetPositions) => {
  const planet_orbits = {};
  for (let day in planetPositions) {
    for (let planet of planetNames) {
      if (planet_orbits[planet]) {
        planet_orbits[planet].push(planetPositions[day][planet]);
      } else {
        planet_orbits[planet] = [planetPositions[day][planet]];
      }
    }
  }
  return planet_orbits;
};

const planet_orbits = createPlanetPositionsObject(
  planetPositionsAc_1751_2099_5d
);

const drawOrbitByPlanet = (planet, planet_orbits) => {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(planet_orbits[planet].flat());
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.LineBasicMaterial({ color: "gray" });
  const line = new THREE.Line(geometry, material);
  scene.add(line);
};

export const drawOrbits = () => {
  for (let planet of planetNames) {
    drawOrbitByPlanet(planet, planet_orbits);
  }
};
