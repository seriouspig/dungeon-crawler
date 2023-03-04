import React from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import texture from "./img/floor.jpg";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";

const App4 = ({ pos }) => {
//   const colorMap = useLoader(TextureLoader, texture);

  return (
    <Canvas>
      <Suspense fallback={null}>
        <mesh rotation={[0, 0, 0]} position={pos}>
          <boxGeometry attach="geometry" args={[1, 1, 1]} />

          <meshStandardMaterial />
        </mesh>
      </Suspense>
    </Canvas>
  );
};

export default App4;
