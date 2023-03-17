import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from 'three'
import { useTexture } from "@react-three/drei";

const Model = (props) => {
  const model = useLoader(GLTFLoader, props.path);
  console.log(model);
  var newMaterial = new THREE.MeshStandardMaterial(Map);
const wardrobeLoader2 = new THREE.TextureLoader().load([
  "./gobelin_monster/textures/Gobelin_baseColor.png"
]);
  

  model.scene.traverse(child => {
      if (child.isMesh) {
          console.log(child.name)
          child.castShadow = true
          child.receiveShadow = true
          child.material = newMaterial
          if (child.name === "arms_ok_arms_0") {
              console.log("THIIIIIS SHOUUUULD MAPP CORRECTLY")
            child.material.map = wardrobeLoader2;
          } 
        //   child.material.side = THREE.FrontSide
      }
  })

  return <primitive object={model.scene} {...props} />;
};

export default Model;
