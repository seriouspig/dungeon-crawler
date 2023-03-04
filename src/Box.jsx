import { Box, Plane } from "@react-three/drei";
import texture from "./img/test.jpeg";
import { TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";


export default function Box2(props) {
  // const img = useTexture("./img/test.jpeg");
  // const colorMap = useLoader(TextureLoader, texture);
    const earth = new TextureLoader().load("./img/floor.jpg");

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