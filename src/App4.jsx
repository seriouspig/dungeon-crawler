import React from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import texture from "./img/floor.jpg";
import { Suspense } from "react";

const App4 = ({ pos }) => {
  const colorMap = useLoader(TextureLoader, texture);

  return (
    <mesh rotation={[0, 0, 0]} position={pos}>
      <boxGeometry attach="geometry" args={[1, 1, 1]} />
      <Suspense fallback={<meshStandardMaterial />}>
        <meshStandardMaterial map={colorMap} />
      </Suspense>
    </mesh>
  );
};

export default App4;
