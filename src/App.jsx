import "./styles.css";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  PerspectiveCamera,
  CameraControls,
  Plane,
  usePerformanceMonitor,
} from "@react-three/drei";
import { Suspense, useState, useRef, useEffect } from "react";
import Box3 from "./Box3";
import { useTexture } from "@react-three/drei";
import { TextureLoader } from "three";
import { MathUtils } from "three";
import * as THREE from "three";
import state from "./state";
import maze from "./maze";
import CameraControl from "./CameraControl";

const mazeArray = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 9, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

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

  const [playerPosition, setPlayerPosition] = useState([0, 0, 0]);
  const [playerDirection, setPlayerDirection] = useState("N");
  const directions = ["N", "E", "S", "W"];

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
  };

  useEffect(() => {
    console.log(playerPosition);
  }, [playerPosition]);

  const handleMoveForward = () => {
    console.log(playerPosition);
    console.log(checkifBlockToNorth(playerPosition));
    console.log(state.playerDir);
    if (
      state.playerDir === "N" &&
      checkifBlockToNorth([state.posX, state.posY, state.posZ])
    ) {
      state.posZ -= 1;
      state.target = new THREE.Vector3(state.posX, state.posY, state.posZ);
      cameraControlRef.current?.forward(1.1, true);
    } else if (
      state.playerDir === "W" &&
      checkifBlockToWest([state.posX, state.posY, state.posZ])
    ) {
      state.posX -= 1;
      state.target = new THREE.Vector3(state.posX, state.posY, state.posZ);
      cameraControlRef.current?.forward(1.1, true);
    } else if (
      state.playerDir === "E" &&
      checkifBlockToEast([state.posX, state.posY, state.posZ])
    ) {
      state.posX += 1;
      state.target = new THREE.Vector3(state.posX, state.posY, state.posZ);
      cameraControlRef.current?.forward(1.1, true);
    } else if (
      state.playerDir === "S" &&
      checkifBlockToSouth([state.posX, state.posY, state.posZ])
    ) {
      state.posZ += 1;
      state.target = new THREE.Vector3(state.posX, state.posY, state.posZ);
      cameraControlRef.current?.forward(1.1, true);
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
      cameraControlRef.current?.forward(-1.1, true);
    } else if (
      state.playerDir === "W" &&
      checkifBlockToEast([state.posX, state.posY, state.posZ])
    ) {
      state.posX += 1;
      state.target = new THREE.Vector3(state.posX, state.posY, state.posZ);
      cameraControlRef.current?.forward(-1.1, true);
    } else if (
      state.playerDir === "E" &&
      checkifBlockToEast([state.posX, state.posY, state.posZ])
    ) {
      state.posX -= 1;
      state.target = new THREE.Vector3(state.posX, state.posY, state.posZ);
      cameraControlRef.current?.forward(-1.1, true);
    } else if (
      state.playerDir === "S" &&
      checkifBlockToSouth([state.posX, state.posY, state.posZ])
    ) {
      state.posZ -= 1;
      state.target = new THREE.Vector3(state.posX, state.posY, state.posZ);
      cameraControlRef.current?.forward(-1.1, true);
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
      cameraControlRef.current?.truck(-1.1, 0, true);
    } else if (
      state.playerDir === "W" &&
      checkifBlockToSouth([state.posX, state.posY, state.posZ])
    ) {
      state.posZ += 1;
      state.target = new THREE.Vector3(state.posX, state.posY, state.posZ);
      cameraControlRef.current?.truck(-1.1, 0, true);
    } else if (
      state.playerDir === "E" &&
      checkifBlockToNorth([state.posX, state.posY, state.posZ])
    ) {
      state.posZ -= 1;
      state.target = new THREE.Vector3(state.posX, state.posY, state.posZ);
      cameraControlRef.current?.truck(-1.1, 0, true);
    } else if (
      state.playerDir === "S" &&
      checkifBlockToSouth([state.posX, state.posY, state.posZ])
    ) {
      state.posX += 1;
      state.target = new THREE.Vector3(state.posX, state.posY, state.posZ);
      cameraControlRef.current?.truck(-1.1, 0, true);
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
      cameraControlRef.current?.truck(1.1, 0, true);
    } else if (
      state.playerDir === "W" &&
      checkifBlockToNorth([state.posX, state.posY, state.posZ])
    ) {
      state.posZ -= 1;
      state.target = new THREE.Vector3(state.posX, state.posY, state.posZ);
      cameraControlRef.current?.truck(1.1, 0, true);
    } else if (
      state.playerDir === "E" &&
      checkifBlockToSouth([state.posX, state.posY, state.posZ])
    ) {
      state.posZ += 1;
      state.target = new THREE.Vector3(state.posX, state.posY, state.posZ);
      cameraControlRef.current?.truck(1.1, 0, true);
    } else if (
      state.playerDir === "S" &&
      checkifBlockToWest([state.posX, state.posY, state.posZ])
    ) {
      state.posX -= 1;
      state.target = new THREE.Vector3(state.posX, state.posY, state.posZ);
      cameraControlRef.current?.truck(1.1, 0, true);
    }
  };

  return (
    <>
      <button onClick={handleMoveForward}>move forward</button>
      <button onClick={handleMoveBackward}>move backward</button>
      <button onClick={handleMoveLeft}>move left</button>
      <button onClick={handleMoveRight}>move right</button>
      <button
        onClick={() => {
          console.log("Rotate right clicked");
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
        }}
      >
        rotate left
      </button>
      <button
        onClick={() => {
          console.log("Rotate right clicked");
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
        }}
      >
        rotate right
      </button>
      <button onClick={updateCameraPosition}>update camera position</button>
      <Canvas ref={canvasRef} shadows shadowMap>
        {/* <ambientLight intensity={0.01} /> */}
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
          <CameraControl />
        </group>
        <CameraControls ref={cameraControlRef} distance={0.01} />
        <axesHelper args={[5]} />
        <gridHelper />
        <MazeModel />
      </Canvas>
    </>
  );
};

export default App;
