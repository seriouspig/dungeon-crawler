import * as THREE from "three";
// model3 name: "Capot001_CAR_PAINT_0"
// model s name: "object005_bod_0"
const state = {
  boxPos: new THREE.Vector3(4, 0, 0),
  cameraPos: new THREE.Vector3(0, 0, 0),

  posX: 0,
  posY: 0,
  posZ: 0,
  target: new THREE.Vector3(0, 0, 0),
  shouldUpdate: true,
  playerDir: "N",
  queue: [],

  // enemyPos: new THREE.Vector3(-4, -0.5, -2),
  enemyPos: [-4, -0.5, -2],
  // enemyPath: [
  //   new THREE.Vector3(-4, -0.5, -2),
  //   new THREE.Vector3(-3, -0.5, -2),
  //   new THREE.Vector3(-2, -0.5, -2),
  //   new THREE.Vector3(-1, -0.5, -2),
  //   new THREE.Vector3(0, -0.5, -2),
  //   new THREE.Vector3(1, -0.5, -2),
  //   new THREE.Vector3(2, -0.5, -2),
  //   new THREE.Vector3(3, -0.5, -2),
  // ],
  enemyPath: [
    [-4, -0.5, -2],
    [-3, -0.5, -2],
    [-2, -0.5, -2],
    [-1, -0.5, -2],
    [0, -0.5, -2],
    [1, -0.5, -2],
    [2, -0.5, -2],
    [3, -0.5, -2],
  ],
  enemyRotation: [0, Math.PI / 2, 0],
};

export default state;
