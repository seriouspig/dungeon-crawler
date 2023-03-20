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
    console.log("Monster moving forward")
    console.log(monsterRef)
    console.log(monsterRef.current.position)
    console.log(state.target.x)
    const newX = state.target.x
    const newY = state.target.y
    const newZ = state.target.z
    state.enemyPos = new THREE.Vector3(newX, -0.5, newZ);
  }

  return (
    <>
      <div className="canvas-container">
        <Canvas ref={canvasRef} shadows>
          {/* <ambientLight intensity={0.01} /> */}
          <Suspense fallback={null}>
            <Model
              ref={monsterRef}
              path="/zombie/scene.gltf"
              scale={new Array(3).fill(0.2)}
              position={state.enemyPos}
              rotation={[0, Math.PI / 2, 0]}
            />
          </Suspense>
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
        <button onClick={handleMoveMonsterForward}>Move monster forward</button>
        <button onClick={updateCameraPosition}>update camera position</button>
      </div>
    </>
  );
};

export default App;
