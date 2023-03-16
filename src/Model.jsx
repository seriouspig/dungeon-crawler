import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from 'three'
import { useTexture } from "@react-three/drei";

const Model = (props) => {
  const model = useLoader(GLTFLoader, props.path);
  console.log(model);
  var newMaterial = new THREE.MeshPhysicalMaterial({ color: "darkgrey" });

  model.scene.traverse(child => {
      if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
          child.material = newMaterial
          child.material.side = THREE.FrontSide
      }
  })

  return <primitive object={model.scene} {...props} />;
};

export default Model;
