import "./styles.css";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  PerspectiveCamera,
  CameraControls,
  Plane,
  usePerformanceMonitor,
} from "@react-three/drei";
import { Suspense, useState, useRef, useEffect, forwardRef } from "react";
import Box3 from "./Box3";
import { useTexture } from "@react-three/drei";
import { TextureLoader } from "three";
import { MathUtils } from "three";
import * as THREE from "three";
import state from "./state";
import maze from "./maze";
import CameraControl from "./CameraControl";
import arrow_up from "./img/0_arrow.png";
import arrow_down from "./img/0_arrow.png";
import arrow_left from "./img/0_arrow.png";
import arrow_right from "./img/0_arrow.png";
import arrow_turn_left from "./img/0_arrow_curved.png";
import arrow_turn_right from "./img/0_arrow_curved.png";
import jumpscare_img from "./img/monster_1.gif"
import Model from "./Model";

const MazeModel = () => {
  let arrayOfBlocks = [];
  for (let i = 0; i < maze.length; i++) {
    for (let j = 0; j < maze[i].length; j++) {
      if (maze[i][j] == 1) {
        arrayOfBlocks.push(<Box3 position={[j - 5, 0, i - 5]} receiveShadow />);
      }
    }
  }
  return arrayOfBlocks;
};

const MovingLight = (props) => {
  const [pp, setPp] = useState(props.playerPos);
  const light = useRef();

  useFrame(({ camera, scene }) => {
    if (state.shouldUpdate) {
      light.current.position.lerp(state.target, 0.1);
    }
  });

  return <pointLight ref={light} intensity={2} castShadow distance={3} />;
};

const MovingRedLight = (props) => {
  const [pp, setPp] = useState(props.playerPos);
  const redlight = useRef();

  useFrame(({ camera, scene }) => {
    if (state.shouldUpdate) {
      // redlight.current.position.lerp(state.enemyPos, 0.1);
      redlight.current.position.lerp(
        new THREE.Vector3(state.enemyPos[0], 0, state.enemyPos[2]),
        0.1
      );
    }
  });

  return (
    <pointLight
      ref={redlight}
      intensity={2}
      castShadow
      distance={5}
      color={"#ff0000"}
    />
  );
};

const App = () => {
  const earth = new TextureLoader().load("textures/floor.jpg");
  earth.wrapS = THREE.RepeatWrapping;
  earth.wrapT = THREE.RepeatWrapping;
  earth.repeat.set(30, 30);

  const cameraControlRef = useRef(null);
  const DEG45 = Math.PI / 4;
  const DEG90 = Math.PI / 2;

  const canvasRef = useRef(null);

  const playerRef = useRef(null);

  const monsterRef = useRef(null);

  const [playerPosition, setPlayerPosition] = useState([0, 0, 0]);
  const [playerDirection, setPlayerDirection] = useState("N");
  const [moveQueue, setMoveQueue] = useState([]);
  const [jumpscare, setJumpscare] = useState(false);
  let directions = ["N", "E", "S", "W"];

  const checkifBlockToNorth = (currentPos) => {
    const wallToNorth = maze[currentPos[2] - 1 + 5][currentPos[0] + 5];
    console.log(wallToNorth);
    if (wallToNorth == 0) return true;
    return false;
  };
  const checkifBlockToWest = (currentPos) => {
    const wallToWest = maze[currentPos[2] + 5][currentPos[0] - 1 + 5];
    console.log(wallToWest);
    if (wallToWest == 0) return true;
    return false;
  };
  const checkifBlockToEast = (currentPos) => {
    const wallToEast = maze[currentPos[2] + 5][currentPos[0] + 1 + 5];
    console.log(wallToEast);
    if (wallToEast == 0) return true;
    return false;
  };
  const checkifBlockToSouth = (currentPos) => {
    const wallToSouth = maze[currentPos[2] + 1 + 5][currentPos[0] + 5];
    console.log(wallToSouth);
    if (wallToSouth == 0) return true;
    return false;
  };

  function round(v) {
    return v >= 0 ? Math.round(v) : 0 - Math.round(0 - v);
  }

  const updateCameraPosition = () => {
    console.log(cameraControlRef.current._camera.position.x);
    let newX = round(cameraControlRef.current._camera.position.x);
    let newY = round(cameraControlRef.current._camera.position.y);
    let newZ = round(cameraControlRef.current._camera.position.z);
    let newPos = [newX, newY, newZ];
    setPlayerPosition(newPos);
    checkifBlockToNorth(newPos);
    console.log(playerDirection);
    console.log(cameraControlRef.current);
  };

  useEffect(() => {
    console.log(playerPosition);
  }, [playerPosition]);

  useEffect(() => {
    console.log(cameraControlRef);
  }, [cameraControlRef]);

  const handleMoveForward = () => {
    console.log(playerPosition);
    console.log(checkifBlockToNorth(playerPosition));
    console.log(state.playerDir);
    console.log(cameraControlRef.current._hasRested);
    if (
      state.playerDir === "N" &&
      checkifBlockToNorth([state.posX, state.posY, state.posZ])
    ) {
      state.posZ -= 1;
      state.target = new THREE.Vector3(state.posX, state.posY, state.posZ);
      cameraControlRef.current?.forward(1, true);
    } else if (
      state.playerDir === "W" &&
      checkifBlockToWest([state.posX, state.posY, state.posZ])
    ) {
      state.posX -= 1;
      state.target = new THREE.Vector3(state.posX, state.posY, state.posZ);
      cameraControlRef.current?.forward(1, true);
    } else if (
      state.playerDir === "E" &&
      checkifBlockToEast([state.posX, state.posY, state.posZ])
    ) {
      state.posX += 1;
      state.target = new THREE.Vector3(state.posX, state.posY, state.posZ);
      cameraControlRef.current?.forward(1, true);
    } else if (
      state.playerDir === "S" &&
      checkifBlockToSouth([state.posX, state.posY, state.posZ])
    ) {
      state.posZ += 1;
      state.target = new THREE.Vector3(state.posX, state.posY, state.posZ);
      cameraControlRef.current?.forward(1, true);
    }
  };
  const handleMoveBackward = () => {
    console.log(playerPosition);
    console.log(checkifBlockToNorth(playerPosition));
    console.log(state.playerDir);
    if (
      state.playerDir === "N" &&
      checkifBlockToSouth([state.posX, state.posY, state.posZ])
    ) {
      state.posZ += 1;
      state.target = new THREE.Vector3(state.posX, state.posY, state.posZ);
      cameraControlRef.current?.forward(-1, true);
    } else if (
      state.playerDir === "W" &&
      checkifBlockToEast([state.posX, state.posY, state.posZ])
    ) {
      state.posX += 1;
      state.target = new THREE.Vector3(state.posX, state.posY, state.posZ);
      cameraControlRef.current?.forward(-1, true);
    } else if (
      state.playerDir === "E" &&
      checkifBlockToWest([state.posX, state.posY, state.posZ])
    ) {
      state.posX -= 1;
      state.target = new THREE.Vector3(state.posX, state.posY, state.posZ);
      cameraControlRef.current?.forward(-1, true);
    } else if (
      state.playerDir === "S" &&
      checkifBlockToNorth([state.posX, state.posY, state.posZ])
    ) {
      state.posZ -= 1;
      state.target = new THREE.Vector3(state.posX, state.posY, state.posZ);
      cameraControlRef.current?.forward(-1, true);
    }
  };
  const handleMoveLeft = () => {
    console.log(playerPosition);
    console.log(checkifBlockToNorth(playerPosition));
    console.log(state.playerDir);
    if (
      state.playerDir === "N" &&
      checkifBlockToWest([state.posX, state.posY, state.posZ])
    ) {
      state.posX -= 1;
      state.target = new THREE.Vector3(state.posX, state.posY, state.posZ);
      cameraControlRef.current?.truck(-1, 0, true);
    } else if (
      state.playerDir === "W" &&
      checkifBlockToSouth([state.posX, state.posY, state.posZ])
    ) {
      state.posZ += 1;
      state.target = new THREE.Vector3(state.posX, state.posY, state.posZ);
      cameraControlRef.current?.truck(-1, 0, true);
    } else if (
      state.playerDir === "E" &&
      checkifBlockToNorth([state.posX, state.posY, state.posZ])
    ) {
      state.posZ -= 1;
      state.target = new THREE.Vector3(state.posX, state.posY, state.posZ);
      cameraControlRef.current?.truck(-1, 0, true);
    } else if (
      state.playerDir === "S" &&
      checkifBlockToEast([state.posX, state.posY, state.posZ])
    ) {
      state.posX += 1;
      state.target = new THREE.Vector3(state.posX, state.posY, state.posZ);
      cameraControlRef.current?.truck(-1, 0, true);
    }
  };
  const handleMoveRight = () => {
    console.log(playerPosition);
    console.log(checkifBlockToNorth(playerPosition));
    console.log(state.playerDir);
    if (
      state.playerDir === "N" &&
      checkifBlockToEast([state.posX, state.posY, state.posZ])
    ) {
      state.posX += 1;
      state.target = new THREE.Vector3(state.posX, state.posY, state.posZ);
      cameraControlRef.current?.truck(1, 0, true);
    } else if (
      state.playerDir === "W" &&
      checkifBlockToNorth([state.posX, state.posY, state.posZ])
    ) {
      state.posZ -= 1;
      state.target = new THREE.Vector3(state.posX, state.posY, state.posZ);
      cameraControlRef.current?.truck(1, 0, true);
    } else if (
      state.playerDir === "E" &&
      checkifBlockToSouth([state.posX, state.posY, state.posZ])
    ) {
      state.posZ += 1;
      state.target = new THREE.Vector3(state.posX, state.posY, state.posZ);
      cameraControlRef.current?.truck(1, 0, true);
    } else if (
      state.playerDir === "S" &&
      checkifBlockToWest([state.posX, state.posY, state.posZ])
    ) {
      state.posX -= 1;
      state.target = new THREE.Vector3(state.posX, state.posY, state.posZ);
      cameraControlRef.current?.truck(1, 0, true);
    }
  };
  const handleRotateLeft = () => {
    console.log("Rotate right clicked");
    if (cameraControlRef.current._hasRested) {
      cameraControlRef.current?.rotate(DEG90, 0, true);

      if (state.playerDir === "N") {
        state.playerDir = "W";
      } else if (state.playerDir === "W") {
        state.playerDir = "S";
      } else if (state.playerDir === "S") {
        state.playerDir = "E";
      } else if (state.playerDir === "E") {
        state.playerDir = "N";
      }
      console.log(state.playerDir);
    }
  };

  const handleRotateRight = () => {
    console.log("Rotate right clicked");
    if (cameraControlRef.current._hasRested) {
      cameraControlRef.current?.rotate(-DEG90, 0, true);
      if (state.playerDir === "N") {
        state.playerDir = "E";
      } else if (state.playerDir === "E") {
        state.playerDir = "S";
      } else if (state.playerDir === "S") {
        state.playerDir = "W";
      } else if (state.playerDir === "W") {
        state.playerDir = "N";
      }
      console.log(state.playerDir);
    }
  };

  const executeQueue = () => {
    if (cameraControlRef.current._hasRested) {
      if (state.queue[0] === "left") {
        console.log("moving left");
        handleMoveLeft();
      } else if (state.queue[0] === "right") {
        console.log("moving right");
        handleMoveRight();
      } else if (state.queue[0] === "forward") {
        console.log("moving forward");
        handleMoveForward();
      } else if (state.queue[0] === "backward") {
        console.log("moving backward");
        handleMoveBackward();
      } else if (state.queue[0] === "turnRight") {
        console.log("turning right");
        handleRotateRight();
      } else if (state.queue[0] === "turnLeft") {
        console.log("turning left");
        handleRotateLeft();
      }
      state.queue.shift();

      setTimeout(function () {
        if (state.queue.length > 0) {
          console.log("Executed after 1 second");
          executeQueue();
        }
      }, 400);
    } else {
      console.log("Camera still moving");
    }
  };

  const handlePushToQueue = (movement) => {
    state.queue.push(movement);
    if (state.queue.length > 0) {
      executeQueue();
    }
  };

  const handleMoveMonsterForward = () => {
    console.log("Monster moving forward");
    console.log(monsterRef);
    console.log(monsterRef.current.position);
    console.log(state.target.x);
    const newX = state.target.x;
    const newY = state.target.y;
    const newZ = state.target.z;
    state.enemyPos = new THREE.Vector3(newX, -0.5, newZ);
  };

  let counter = 0;
  let direction = "right";

  let enemyN = Math.PI;
  let enemyS = 2 * Math.PI;
  let enemyE = Math.PI / 2;
  let enemyW = -Math.PI / 2;

  state.enemyRotation[1] === enemyE;

  // MONSTER MOVEMENT OLD
  setInterval(() => {
    moveEnemy();
    // console.log("ENEMY POSITION: " + state.enemyPos);
    // console.log("PLAYER POSITION: " + [state.posX, state.posY, state.posZ]);
    // if (state.enemyPos[0] === state.posX && state.enemyPos[2] === state.posZ) {
    //   console.log("JUUUUUUUUMMMMMMMPPPSCCCAAAAAAREEEEEEEEE !!!!");
    //   setJumpscare(true);
    // }
  }, 1000);

    setInterval(() => {

      console.log("ENEMY POSITION: " + state.enemyPos);
      console.log("PLAYER POSITION: " + [state.posX, state.posY, state.posZ]);
      if (
        state.enemyPos[0] === state.posX &&
        state.enemyPos[2] === state.posZ
      ) {
        console.log("JUUUUUUUUMMMMMMMPPPSCCCAAAAAAREEEEEEEEE !!!!");
        setJumpscare(true);
      }
    }, 200);

  // MONSTER MOVEMENT NEW
  const moveEnemy = () => {
    // -------------------- MOVING EAST -----------------------
    if (state.enemyRotation[1] === enemyE) {
      direction = "east";
      if (
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 + 1] === 0 &&
        maze[state.enemyPos[2] + 5 - 1][state.enemyPos[0] + 5] === 1 &&
        maze[state.enemyPos[2] + 5 + 1][state.enemyPos[0] + 5] === 1
      ) {
        console.log("Moving Forward");
        state.enemyPos = [
          state.enemyPos[0] + 1,
          state.enemyPos[1],
          state.enemyPos[2],
        ];
      } else if (
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 + 1] === 1 &&
        maze[state.enemyPos[2] + 5 - 1][state.enemyPos[0] + 5] === 1 &&
        maze[state.enemyPos[2] + 5 + 1][state.enemyPos[0] + 5] === 1
      ) {
        console.log("Turning Back");
        state.enemyRotation = [0, enemyW, 0];
        direction = "west";
      } else if (
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 + 1] === 1 &&
        maze[state.enemyPos[2] + 5 - 1][state.enemyPos[0] + 5] === 1 &&
        maze[state.enemyPos[2] + 5 + 1][state.enemyPos[0] + 5] === 0
      ) {
        console.log("Turning Right");
        state.enemyRotation = [0, enemyS, 0];
        direction = "south";
      } else if (
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 + 1] === 0 &&
        maze[state.enemyPos[2] + 5 - 1][state.enemyPos[0] + 5] === 1 &&
        maze[state.enemyPos[2] + 5 + 1][state.enemyPos[0] + 5] === 1
      ) {
        console.log("Turning Left");
        state.enemyRotation = [0, enemyN, 0];
        direction = "north";
      }
      // -------- RANDOM CHOICES --------
      else if (
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 + 1] === 0 &&
        maze[state.enemyPos[2] + 5 - 1][state.enemyPos[0] + 5] === 1 &&
        maze[state.enemyPos[2] + 5 + 1][state.enemyPos[0] + 5] === 0
      ) {
        // Do a 50% random choice
        console.log("Doing 50% random choice");
        const array = [enemyE, enemyS];
        const randomIndex = Math.floor(Math.random() * array.length);
        let direction = array[randomIndex];
        state.enemyRotation = [0, direction, 0];
        console.log("------------------------");
        if (direction === enemyE) {
          state.enemyPos = [
            state.enemyPos[0] + 1,
            state.enemyPos[1],
            state.enemyPos[2],
          ];
          direction = "east";
        } else if (direction === enemyS) {
          state.enemyPos = [
            state.enemyPos[0],
            state.enemyPos[1],
            state.enemyPos[2] + 1,
          ];
          direction = "south";
        }
      } else if (
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 + 1] === 0 &&
        maze[state.enemyPos[2] + 5 - 1][state.enemyPos[0] + 5] === 0 &&
        maze[state.enemyPos[2] + 5 + 1][state.enemyPos[0] + 5] === 1
      ) {
        // Do a 50% random choice
        console.log("Doing 50% random choice");
        const array = [enemyE, enemyN];
        const randomIndex = Math.floor(Math.random() * array.length);
        let direction = array[randomIndex];
        state.enemyRotation = [0, direction, 0];
        if (direction === enemyE) {
          state.enemyPos = [
            state.enemyPos[0] + 1,
            state.enemyPos[1],
            state.enemyPos[2],
          ];
          direction = "east";
        } else if (direction === enemyN) {
          state.enemyPos = [
            state.enemyPos[0],
            state.enemyPos[1],
            state.enemyPos[2] - 1,
          ];
          direction = "north";
        }
      } else if (
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 - 1] === 0 &&
        maze[state.enemyPos[2] + 5 - 1][state.enemyPos[0] + 5] === 0 &&
        maze[state.enemyPos[2] + 5 + 1][state.enemyPos[0] + 5] === 0
      ) {
        // Do a 50% random choice
        console.log("Doing 50% random choice");
        const array = [enemyS, enemyN];
        const randomIndex = Math.floor(Math.random() * array.length);
        let direction = array[randomIndex];
        state.enemyRotation = [0, direction, 0];
        if (direction === enemyS) {
          state.enemyPos = [
            state.enemyPos[0],
            state.enemyPos[1],
            state.enemyPos[2] + 1,
          ];
          direction = "southt";
        } else if (direction === enemyN) {
          state.enemyPos = [
            state.enemyPos[0],
            state.enemyPos[1],
            state.enemyPos[2] - 1,
          ];
          direction = "north";
        }
      }
    }
    // -------------------- MOVING SOUTH -----------------------
    else if (state.enemyRotation[1] === enemyS) {
      direction = "south";
      if (
        maze[state.enemyPos[2] + 5 + 1][state.enemyPos[0] + 5] === 0 &&
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 + 1] === 1 &&
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 - 1] === 1
      ) {
        console.log("Moving Forward");
        state.enemyPos = [
          state.enemyPos[0],
          state.enemyPos[1],
          state.enemyPos[2] + 1,
        ];
      } else if (
        maze[state.enemyPos[2] + 5 + 1][state.enemyPos[0] + 5] === 1 &&
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 + 1] === 1 &&
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 - 1] === 1
      ) {
        console.log("Turning Back");
        state.enemyRotation = [0, enemyN, 0];
        direction = "north";
      } else if (
        maze[state.enemyPos[2] + 5 + 1][state.enemyPos[0] + 5] === 1 &&
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 + 1] === 1 &&
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 - 1] === 0
      ) {
        console.log("Turning Right");
        state.enemyRotation = [0, enemyW, 0];
        direction = "west";
      } else if (
        maze[state.enemyPos[2] + 5 + 1][state.enemyPos[0] + 5] === 1 &&
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 + 1] === 0 &&
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 - 1] === 1
      ) {
        console.log("Turning Left");
        state.enemyRotation = [0, enemyE, 0];
        direction = "east";
      }
      // -------- RANDOM CHOICES --------
      else if (
        maze[state.enemyPos[2] + 5 + 1][state.enemyPos[0] + 5] === 0 &&
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 + 1] === 0 &&
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 - 1] === 1
      ) {
        // Do a 50% random choice
        console.log("Doing 50% random choice");
        const array = [enemyE, enemyS];
        const randomIndex = Math.floor(Math.random() * array.length);
        let direction = array[randomIndex];
        state.enemyRotation = [0, direction, 0];
        console.log("------------------------");
        if (direction === enemyE) {
          state.enemyPos = [
            state.enemyPos[0] + 1,
            state.enemyPos[1],
            state.enemyPos[2],
          ];
          direction = "east";
        } else if (direction === enemyS) {
          state.enemyPos = [
            state.enemyPos[0],
            state.enemyPos[1],
            state.enemyPos[2] + 1,
          ];
          direction = "south";
        }
      } else if (
        maze[state.enemyPos[2] + 5 + 1][state.enemyPos[0] + 5] === 0 &&
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 + 1] === 1 &&
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 - 1] === 0
      ) {
        // Do a 50% random choice
        console.log("Doing 50% random choice");
        const array = [enemyW, enemyS];
        const randomIndex = Math.floor(Math.random() * array.length);
        let direction = array[randomIndex];
        state.enemyRotation = [0, direction, 0];
        if (direction === enemyW) {
          state.enemyPos = [
            state.enemyPos[0] - 1,
            state.enemyPos[1],
            state.enemyPos[2],
          ];
          direction = "west";
        } else if (direction === enemyS) {
          state.enemyPos = [
            state.enemyPos[0],
            state.enemyPos[1],
            state.enemyPos[2] + 1,
          ];
          direction = "south";
        }
      } else if (
        maze[state.enemyPos[2] + 5 - 1][state.enemyPos[0] + 5] === 0 &&
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 + 1] === 0 &&
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 - 1] === 0
      ) {
        // Do a 50% random choice
        console.log("Doing 50% random choice");
        const array = [enemyE, enemyW];
        const randomIndex = Math.floor(Math.random() * array.length);
        let direction = array[randomIndex];
        state.enemyRotation = [0, direction, 0];
        if (direction === enemyE) {
          state.enemyPos = [
            state.enemyPos[0] + 1,
            state.enemyPos[1],
            state.enemyPos[2],
          ];
          direction = "east";
        } else if (direction === enemyW) {
          state.enemyPos = [
            state.enemyPos[0] - 1,
            state.enemyPos[1],
            state.enemyPos[2],
          ];
          direction = "west";
        }
      }
    }
    // -------------------- MOVING WEST -----------------------
    else if (state.enemyRotation[1] === enemyW) {
      direction = "west";
      if (
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 - 1] === 0 &&
        maze[state.enemyPos[2] + 5 - 1][state.enemyPos[0] + 5] === 1 &&
        maze[state.enemyPos[2] + 5 + 1][state.enemyPos[0] + 5] === 1
      ) {
        console.log("Moving Forward");
        state.enemyPos = [
          state.enemyPos[0] - 1,
          state.enemyPos[1],
          state.enemyPos[2],
        ];
      } else if (
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 - 1] === 1 &&
        maze[state.enemyPos[2] + 5 - 1][state.enemyPos[0] + 5] === 1 &&
        maze[state.enemyPos[2] + 5 + 1][state.enemyPos[0] + 5] === 1
      ) {
        console.log("Turning Back");
        state.enemyRotation = [0, enemyE, 0];
        direction = "east";
      } else if (
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 - 1] === 1 &&
        maze[state.enemyPos[2] + 5 - 1][state.enemyPos[0] + 5] === 0 &&
        maze[state.enemyPos[2] + 5 + 1][state.enemyPos[0] + 5] === 1
      ) {
        console.log("Turning Right");
        state.enemyRotation = [0, enemyN, 0];
        direction = "north";
      } else if (
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 - 1] === 1 &&
        maze[state.enemyPos[2] + 5 - 1][state.enemyPos[0] + 5] === 1 &&
        maze[state.enemyPos[2] + 5 + 1][state.enemyPos[0] + 5] === 0
      ) {
        console.log("Turning Left");
        state.enemyRotation = [0, enemyS, 0];
        direction = "south";
      }
      // -------- RANDOM CHOICES --------
      else if (
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 - 1] === 0 &&
        maze[state.enemyPos[2] + 5 - 1][state.enemyPos[0] + 5] === 1 &&
        maze[state.enemyPos[2] + 5 + 1][state.enemyPos[0] + 5] === 0
      ) {
        // Do a 50% random choice
        console.log("Doing 50% random choice");
        const array = [enemyW, enemyS];
        const randomIndex = Math.floor(Math.random() * array.length);
        let direction = array[randomIndex];
        state.enemyRotation = [0, direction, 0];
        console.log("------------------------");
        if (direction === enemyW) {
          state.enemyPos = [
            state.enemyPos[0] - 1,
            state.enemyPos[1],
            state.enemyPos[2],
          ];
          direction = "west";
        } else if (direction === enemyS) {
          state.enemyPos = [
            state.enemyPos[0],
            state.enemyPos[1],
            state.enemyPos[2] + 1,
          ];
          direction = "south";
        }
      } else if (
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 - 1] === 0 &&
        maze[state.enemyPos[2] + 5 - 1][state.enemyPos[0] + 5] === 0 &&
        maze[state.enemyPos[2] + 5 + 1][state.enemyPos[0] + 5] === 1
      ) {
        // Do a 50% random choice
        console.log("Doing 50% random choice");
        const array = [enemyW, enemyN];
        const randomIndex = Math.floor(Math.random() * array.length);
        let direction = array[randomIndex];
        state.enemyRotation = [0, direction, 0];
        if (direction === enemyW) {
          state.enemyPos = [
            state.enemyPos[0] - 1,
            state.enemyPos[1],
            state.enemyPos[2],
          ];
          direction = "west";
        } else if (direction === enemyN) {
          state.enemyPos = [
            state.enemyPos[0],
            state.enemyPos[1],
            state.enemyPos[2] - 1,
          ];
          direction = "north";
        }
      } else if (
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 + 1] === 0 &&
        maze[state.enemyPos[2] + 5 - 1][state.enemyPos[0] + 5] === 0 &&
        maze[state.enemyPos[2] + 5 + 1][state.enemyPos[0] + 5] === 0
      ) {
        // Do a 50% random choice
        console.log("Doing 50% random choice");
        const array = [enemyS, enemyN];
        const randomIndex = Math.floor(Math.random() * array.length);
        let direction = array[randomIndex];
        state.enemyRotation = [0, direction, 0];
        if (direction === enemyS) {
          state.enemyPos = [
            state.enemyPos[0],
            state.enemyPos[1],
            state.enemyPos[2] + 1,
          ];
          direction = "southt";
        } else if (direction === enemyN) {
          state.enemyPos = [
            state.enemyPos[0],
            state.enemyPos[1],
            state.enemyPos[2] - 1,
          ];
          direction = "north";
        }
      }
    }
    // -------------------- MOVING NORTH -----------------------
    else if (state.enemyRotation[1] === enemyN) {
      direction = "west";
      if (
        maze[state.enemyPos[2] + 5 - 1][state.enemyPos[0] + 5] === 0 &&
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 + 1] === 1 &&
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 - 1] === 1
      ) {
        console.log("Moving Forward");
        state.enemyPos = [
          state.enemyPos[0],
          state.enemyPos[1],
          state.enemyPos[2] - 1,
        ];
      } else if (
        maze[state.enemyPos[2] + 5 - 1][state.enemyPos[0] + 5] === 1 &&
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 + 1] === 1 &&
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 - 1] === 1
      ) {
        console.log("Turning Back");
        state.enemyRotation = [0, enemyE, 0];
        direction = "east";
      } else if (
        maze[state.enemyPos[2] + 5 - 1][state.enemyPos[0] + 5] === 1 &&
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 + 1] === 1 &&
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 - 1] === 0
      ) {
        console.log("Turning Right");
        state.enemyRotation = [0, enemyW, 0];
        direction = "north";
      } else if (
        maze[state.enemyPos[2] + 5 - 1][state.enemyPos[0] + 5] === 1 &&
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 + 1] === 0 &&
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 - 1] === 1
      ) {
        console.log("Turning Left");
        state.enemyRotation = [0, enemyE, 0];
        direction = "south";
      }
      // -------- RANDOM CHOICES --------
      else if (
        maze[state.enemyPos[2] + 5 - 1][state.enemyPos[0] + 5] === 0 &&
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 + 1] === 0 &&
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 - 1] === 1
      ) {
        // Do a 50% random choice
        console.log("Doing 50% random choice");
        const array = [enemyE, enemyN];
        const randomIndex = Math.floor(Math.random() * array.length);
        let direction = array[randomIndex];
        state.enemyRotation = [0, direction, 0];
        console.log("------------------------");
        if (direction === enemyE) {
          state.enemyPos = [
            state.enemyPos[0] + 1,
            state.enemyPos[1],
            state.enemyPos[2],
          ];
          direction = "east";
        } else if (direction === enemyN) {
          state.enemyPos = [
            state.enemyPos[0],
            state.enemyPos[1],
            state.enemyPos[2] - 1,
          ];
          direction = "north";
        }
      } else if (
        maze[state.enemyPos[2] + 5 - 1][state.enemyPos[0] + 5] === 0 &&
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 + 1] === 1 &&
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 - 1] === 0
      ) {
        // Do a 50% random choice
        console.log("Doing 50% random choice");
        const array = [enemyW, enemyN];
        const randomIndex = Math.floor(Math.random() * array.length);
        let direction = array[randomIndex];
        state.enemyRotation = [0, direction, 0];
        if (direction === enemyW) {
          state.enemyPos = [
            state.enemyPos[0] - 1,
            state.enemyPos[1],
            state.enemyPos[2],
          ];
          direction = "west";
        } else if (direction === enemyN) {
          state.enemyPos = [
            state.enemyPos[0],
            state.enemyPos[1],
            state.enemyPos[2] - 1,
          ];
          direction = "north";
        }
      } else if (
        maze[state.enemyPos[2] + 5 + 1][state.enemyPos[0] + 5] === 0 &&
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 + 1] === 0 &&
        maze[state.enemyPos[2] + 5][state.enemyPos[0] + 5 - 1] === 0
      ) {
        // Do a 50% random choice
        console.log("Doing 50% random choice");
        const array = [enemyE, enemyW];
        const randomIndex = Math.floor(Math.random() * array.length);
        let direction = array[randomIndex];
        state.enemyRotation = [0, direction, 0];
        if (direction === enemyE) {
          state.enemyPos = [
            state.enemyPos[0] + 1,
            state.enemyPos[1],
            state.enemyPos[2],
          ];
          direction = "east";
        } else if (direction === enemyW) {
          state.enemyPos = [
            state.enemyPos[0] - 1,
            state.enemyPos[1],
            state.enemyPos[2],
          ];
          direction = "west";
        }
      }
    }
  };

  return (
    <>
      {jumpscare ? (
        <div className="jumpscare" onClick={() => window.location.reload()}>
          <img draggable={false} src={jumpscare_img} alt="" />
        </div>
      ) : (
        <div className="canvas-container">
          <Canvas ref={canvasRef} shadows>
            {/* <ambientLight intensity={0.01} /> */}
            <Suspense fallback={null}>
              <Model
                ref={monsterRef}
                path="/zombie/scene.gltf"
                scale={new Array(3).fill(0.2)}
                position={state.enemyPos}
                rotation={state.enemyRotation}
              />
            </Suspense>
            <MovingRedLight />
            <Plane
              receiveShadow
              rotation={[Math.PI / -2, 0, 0]}
              args={[60, 60, 1]}
              position={[0, -0.5, 0]}
            >
              <meshStandardMaterial map={earth} />
            </Plane>
            <group ref={playerRef}>
              <MovingLight playerPos={playerPosition} />
            </group>
            <CameraControls
              ref={cameraControlRef}
              distance={0.01}
              truckSpeed={0.5}
              smoothTime={0.1}
              // mouseButtons={"NONE"}
              touches={"NONE"}
            />
            {/* <axesHelper args={[5]} /> */}
            {/* <gridHelper /> */}
            <MazeModel />
          </Canvas>
        </div>
      )}
      {!jumpscare && (
        <div className="controls-container">
          <div className="image-container">
            <img
              draggable={false}
              className="arrow-button turn-left"
              onClick={() => handlePushToQueue("turnLeft")}
              src={arrow_turn_left}
              alt=""
            />
          </div>
          <div className="image-container">
            <img
              draggable={false}
              className="arrow-button up"
              onClick={() => handlePushToQueue("forward")}
              src={arrow_up}
              alt=""
            />
          </div>
          <div className="image-container">
            <img
              draggable={false}
              className="arrow-button turn-right"
              onClick={() => handlePushToQueue("turnRight")}
              src={arrow_turn_right}
              alt=""
            />
          </div>
          <div className="image-container">
            <img
              draggable={false}
              className="arrow-button left"
              onClick={() => handlePushToQueue("left")}
              src={arrow_left}
              alt=""
            />
          </div>
          <div className="image-container">
            <img
              draggable={false}
              className="arrow-button down"
              onClick={() => handlePushToQueue("backward")}
              src={arrow_down}
              alt=""
            />
          </div>
          <div className="image-container">
            <img
              draggable={false}
              className="arrow-button right"
              onClick={() => handlePushToQueue("right")}
              src={arrow_right}
              alt=""
            />
          </div>
          {/* <button onClick={handleMoveMonsterForward}>Move monster forward</button>
        <button onClick={updateCameraPosition}>update camera position</button> */}
        </div>
      )}
    </>
  );
};

export default App;
