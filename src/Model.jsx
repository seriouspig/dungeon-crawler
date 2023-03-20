import { useLoader, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from 'three'
import { useTexture } from "@react-three/drei";
import { AnimationMixer } from "three";

const Model = (props) => {
  const model = useLoader(GLTFLoader, props.path);
  console.log(model);
  var newMaterial = new THREE.MeshStandardMaterial(Map);
// const wardrobeLoader2 = new THREE.TextureLoader().load([
//   "./om_nom/textures/onNomMat_baseColor.jpeg"
// ]);
  
  let mixer;
  if (model.animations.length > 0) {
    mixer = new THREE.AnimationMixer(model.scene)
    model.animations.forEach(clip => {
      const action = mixer.clipAction(clip)
      action.play()
    } )
  }

  useFrame((scene, delta) => {
    mixer?.update(delta)
  })

  model.scene.traverse(child => {
      if (child.isMesh) {
          console.log(child.name)
          child.castShadow = true
          child.receiveShadow = true
            // child.material.map = wardrobeLoader2;

          child.material.side = THREE.FrontSide
      }
  })

  return <primitive object={model.scene} {...props} />;
};

export default Model;
