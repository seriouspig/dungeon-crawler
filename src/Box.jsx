import { Box, Plane } from "@react-three/drei";
import texture from "./img/test.jpeg";
import { TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";


export default function Box2(props) {
  // const img = useTexture("./img/test.jpeg");
  // const colorMap = useLoader(TextureLoader, texture);
    // const earth = new TextureLoader().load("./img/floor.jpg");
  const map = useTexture([
    "textures/sky.jpg", // pos-x
    "textures/sky.jpg", // neg-x
    "textures/sky.jpg", // pos-y
    "textures/sky.jpg", // neg-y
    "textures/sky.jpg", // pos-z
    "textures/sky.jpg", // neg-z
  ]);
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

    // <Box castShadow receiveShadow position={props.position}>
    //   <meshBasicMaterial attach="material" map={earth} />
    // </Box>

    <mesh ref={meshRef}>
      <boxBufferGeometry args={[3, 3, 3]} receiveShadow/>
      {map.map((texture, idx) => (
        <meshBasicMaterial
          key={texture.id}
          attach={`material-${idx}`}
          map={texture}
          side={THREE.DoubleSide}
        />
      ))}
    </mesh>

  );
}
