import { Suspense, useRef, useState, forwardRef, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { OrbitControls } from "@react-three/drei";
import state from "./state";

function Box(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef();
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);

  useFrame(({ camera, scene }) => {
    if (state.shouldUpdate) {
      ref.current.position.lerp(state.target, 0.1);
    }
  });

  const performRefresh = () => {
    console.log("REFRESH PERFORMED");
  };

  useEffect(() => {
    performRefresh(); //children function of interest
  }, [props.refresh]);

  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x += delta));
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}

function App5() {
  const [refresh, doRefresh] = useState(0);
  const [playerPos, setPlayerPos] = useState(0, 0, 0);
  const [playerPosX, setPlayerPosX] = useState(0);

  const moveRight = () => {
    console.log("CLICKED !!!");
    state.posX += 2;
    state.target = new THREE.Vector3(state.posX, state.posY, 0);
  };
  const moveLeft = () => {
    console.log("CLICKED !!!");
    state.posX -= 2;
    state.target = new THREE.Vector3(state.posX, state.posY, 0);
  };
  const moveUp = () => {
    console.log("CLICKED !!!");
    state.posY += 2;
    state.target = new THREE.Vector3(state.posX, state.posY, 0);
  };
  const moveDown = () => {
    console.log("CLICKED !!!");
    state.posY -= 2;
    state.target = new THREE.Vector3(state.posX, state.posY, 0);
  };

  return (
    <>
      <div className="canvas-container">
        <button onClick={moveUp}>Move Up</button>
        <button onClick={moveDown}>Move Down</button>
        <button onClick={moveLeft}>Move Left</button>
        <button onClick={moveRight}>Move Right</button>
        <Canvas>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Box position={[-1.2, 0, 0]} />
          <Box position={[1.2, 0, 0]} />
        </Canvas>
      </div>
    </>
  );
}

export default App5;
