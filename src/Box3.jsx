import { Box, Plane } from "@react-three/drei";
import texture from "./img/test.jpeg";
import { TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function Box3(props) {
  // const img = useTexture("./img/test.jpeg");
  // const colorMap = useLoader(TextureLoader, texture);
  const earth = new TextureLoader().load("textures/floor.jpg");
  earth.wrapS = THREE.RepeatWrapping;
  earth.wrapT = THREE.RepeatWrapping;
  earth.repeat.set(1, 1);
  return (
    // <mesh {...props}>
    //   <Box />
    //   <meshStandardMaterial
    //     attach="material"
    //     color={0x6be092}
    //     receiveShadow
    //     castShadow
    //   />
    // </mesh>

    <Box castShadow receiveShadow position={props.position}>
      <meshStandardMaterial attach="material" map={earth} />
    </Box>
  );
}
