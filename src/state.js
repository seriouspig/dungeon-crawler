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
  playerDir: "N"
};

export default state;
