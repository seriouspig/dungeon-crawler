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
  for (let i = 0; i < mazeArray.length; i++) {
    for (let j = 0; j < mazeArray[i].length; j++) {
      if (mazeArray[i][j] == 1) {
        arrayOfBlocks.push(<Box3 position={[j - 5, 0, i - 5]} receiveShadow />);
      }
    }
  }
  return arrayOfBlocks;
};

const MovingLight = (props) => {
  const [pp, setPp] = useState(props.playerPos);
  const light = useRef();
  // useFrame((state) => {
  //   light.current.position.lerp({ x, y, z }, 0.1);
  //   console.log(state)
  // });
  // useFrame(() => {
  //   // lerp cam position to destination
  //   // light.position.lerp(destination, 0.1);
  //   // pause or unpause the loop based on the distance From camera or other heuristics
  //   console.log(light.current.position);

  //   const newPos = new THREE.Vector3(
  //     props.playerPos[0],
  //     props.playerPos[1],
  //     props.playerPos[2]
  //   );
  //     console.log("NEW POS")
  //   console.log(newPos)

  //   // light.current.position.lerp(newPos);
  // });

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

  const [position, setPosition] = useState([0, 0, 0]);
  const [playerPosition, setPlayerPosition] = useState([0, 0, 0]);
  const [playerDirection, setPlayerDirection] = useState("N");
  const directions = ["N", "E", "S", "W"];

  const checkifBlockToNorth = (currentPos) => {
    const wallToNorth = mazeArray[currentPos[2] - 1 + 5][currentPos[0] + 5];
    if (wallToNorth == 0) return true;
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
  };

  useEffect(() => {
    console.log(playerPosition);
  }, [playerPosition]);

  const handleMoveForward = () => {
    let newX = round(cameraControlRef.current._camera.position.x);
    let newY = round(cameraControlRef.current._camera.position.y);
    let newZ = round(cameraControlRef.current._camera.position.z);
    let newPos = [newX, newY, newZ];
        // state.posX = cameraControlRef.current._camera.position.x;
        // state.posY = cameraControlRef.current._camera.position.y;
        // state.posZ = cameraControlRef.current._camera.position.z;
        state.posX -= 1;
        state.target = new THREE.Vector3(state.posX, state.posY, state.posZ);

      cameraControlRef.current?.forward(1, true);

  };
  const handleMoveBackward = () => {
    cameraControlRef.current?.forward(-1, true);
        // state.posX = cameraControlRef.current._camera.position.x;
        // state.posY = cameraControlRef.current._camera.position.y;
        // state.posZ = cameraControlRef.current._camera.position.z;
        state.posX += 1;
        state.target = new THREE.Vector3(state.posX, state.posY, state.posZ);
  };
  const handleMoveLeft = () => {

    console.log(cameraControlRef.current._camera.position.x)
    state.posX = cameraControlRef.current._camera.position.x;
    state.posY = cameraControlRef.current._camera.position.y;
    state.posZ = cameraControlRef.current._camera.position.z;
    state.target = new THREE.Vector3(state.posX, state.posY, state.posZ);
    cameraControlRef.current?.truck(-1, 0, true);
  };
  const handleMoveRight = () => {
    cameraControlRef.current?.truck(1, 0, true);
        state.posX = cameraControlRef.current._camera.position.x;
        state.posY = cameraControlRef.current._camera.position.y;
        state.posZ = cameraControlRef.current._camera.position.z;
        state.target = new THREE.Vector3(state.posX, state.posY, state.posZ);
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
        }}
      >
        rotate left
      </button>
      <button
        onClick={() => {
          console.log("Rotate right clicked");
          cameraControlRef.current?.rotate(-DEG90, 0, true);
        }}
      >
        rotate right
      </button>
      <button onClick={updateCameraPosition}>update camera position</button>
      <Canvas ref={canvasRef} shadows shadowMap>
        <MovingLight playerPos={playerPosition} />
        {/* <ambientLight intensity={0.01} /> */}
        <Plane
          receiveShadow
          rotation={[Math.PI / -2, 0, 0]}
          args={[60, 60, 1]}
          position={[0, -0.5, 0]}
        >
          <meshStandardMaterial map={earth} />
        </Plane>

        <CameraControls ref={cameraControlRef} distance={0.01} />
        <axesHelper args={[5]} />
        <gridHelper />
        <MazeModel />
      </Canvas>
    </>
  );
};

export default App;
