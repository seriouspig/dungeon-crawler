import { useEffect, useState } from "react";
import { Box, Plane, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/*
  Written by Steven Stavrakis, adapted from code by Paul Henschel (@0xca0a on Twitter)

  I'm calling this CLERPING.
  "Click to lerp/slerp"

  Q&A at the bottom of this document

  The general idea:
  1. Create a camera object called the "target camera"
  2. On some interaction, in this case clicking on an object, place the target camera
     where we want our default camera to animate to and rotate it to look at what we 
     want it to look at.
  3. Copy the target position and quaternion into top level variables
  4. In the frame loop, lerp the default camera position to the target camera position
     and slerp the default camera quaternion to the target camera quaternion
  5. When an element is reclicked, return the camera to the original position

  Note: a camera object **must** be used. An object 3D will reverse the rotation.
        That being said, I believe you can achieve the same animation effect with
        matrix transforms which might be different

  Pros of clerping:
  - Fast
  - Easy to implement

  Cons of clerping:
  - Haven't really found any yet
  - Probably doesn't provide the most granual control
*/

// Create three THREE objects to be used later
// c = the "target" camera. A perspective camera. Will not work if this is Object3D
//     the reason object 3d won't work is because cameras look down their negative z-axis
//     and therefore point in a different direction
// p = a vector 3 used to capture the cameras target position
// q = a quaternion used to capture cameras target rotation
const Scene = ({
  p = new THREE.Vector3(),
  q = new THREE.Quaternion(),
  c = new THREE.PerspectiveCamera(),
}) => {
  // We will need access to our camera, so grab the three state
  const state = useThree();

  // We need to know what object was clicked
  // Keeping track of this in state is not super advisable but this setup
  // relies on a new selection causing a re-render. It's probably better
  // to keep track of this in a ref
  const [clicked, setClicked] = useState(null);

  // On first render just point the camera where we want it
  useEffect(() => {
    state.camera.lookAt(0, 0, 0);
  }, []);

  // This is where the magic happens
  // On re-render, we want to...
  useEffect(() => {
    // ...check if there is a currently selected object
    if (clicked !== null) {
      // Update the selected objects world matrix (not sure this is necessary)
      // (true, true) updates it's children and parent matrices I believe
      clicked.updateWorldMatrix(true, true);

      // Put our object into a const because I want to
      const selection = clicked;

      // Grab the position of our selection
      const { position } = selection;

      // Grab the values we assign to object userData.
      // In the return block you can see the value viewPos is a three entry array representing
      // the x, y, and z we want to view the selection from **with relation to the selection**.

      // Make that a Vector3
      const viewPos = new THREE.Vector3(...selection.userData.viewPos);

      // Using the position of the selection, we add our view position.
      // This will give us the world position for our target camera.
      const camPosTarget = new THREE.Vector3(...position).add(viewPos);

      // Put the target camera in the right position.
      c.position.set(0,1,20);

      // Point the target camera where you want to look.
      // In this case we are just going to look right at the selection.
    //   c.lookAt(...position);

      // copy the quaternion of the target camera into q.
      // You can also use .set(...c.quaternion) but copy is cleaner.
      q.copy(c.quaternion);

      // copy the position of the target camera into p.
      p.copy(c.position);
    } else {
      // If nothing is clicked we want to set p back to our start position.
      // In our case we are just hardcoding our camera position back in.
      p.set(0, 1, 50);

      // .identity() resets a quaternion to no rotation.
      // This doesn't bring us back to our original rotation that we set on line 27.
      // You could do that if you want using the same method we use to animate
      // to our target positions.
      // You'll actually notice if you refresh that the camera instanly pans up because of this.
      q.identity();
    }
  });

  // On every frame...
  useFrame((state, dt) => {
    // ...lerp (linear interpolate) the camera position to p.
    state.camera.position.lerp(p, THREE.MathUtils.damp(0, 1, 3, dt));

    // ...slerp (spherical linear interpolate) the camera rotation to quaternion q.
    state.camera.quaternion.slerp(q, THREE.MathUtils.damp(0, 1, 3, dt));

    // I don't have anything to say about lerp and slerp that the docs don't have.
    // No idea what damp actually does, probably just smooths it out.
  });

  // The only thing of note below is that in each Box I provide the viewPos to userData.
  // Make sure that mouse events in r3f are not propogating unless you want them to.
  // Objects behind will also trigger if you don't.
  // I don't know why my shadows aren't working but I don't have time to fix it.

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight
        castShadow
        shadow-mapSize-height={512}
        shadow-mapSize-width={512}
        intensity={0.8}
      />
      <Plane receiveShadow rotation={[Math.PI / -2, 0, 0]} args={[60, 60, 1]}>
        <meshStandardMaterial color={"white"} />
      </Plane>
      <Text
        color="black" // default
        anchorX="center" // default
        anchorY="middle" // default
        rotation={[0, 0, 0]}
        position={[0, 15, -5]}
        fontSize={2}
      >
        Click on a box
      </Text>
      <Text
        color="black" // default
        anchorX="center" // default
        anchorY="middle" // default
        rotation={[Math.PI / 2, Math.PI, 0]}
        position={[-10, 0.1, -3]}
        fontSize={0.3}
      >
        Click the other box
      </Text>
      <Text
        color="white" // default
        anchorX="center" // default
        anchorY="middle" // default
        rotation={[Math.PI / 2, Math.PI / 2, Math.PI / -2]}
        position={[12.1, 3, 0]}
        fontSize={0.3}
      >
        Click the other box
      </Text>
      <Box
        castShadow
        args={[4, 4, 4]}
        position={[10, 2, 0]}
        userData={{ viewPos: [6, 9, 5] }}
        onClick={(e) => {
          e.stopPropagation();
          if (clicked === e.object) {
            setClicked(null);
          } else {
            setClicked(e.object);
          }
        }}
        onPointerMissed={() => {
          setClicked(null);
        }}
      >
        <meshStandardMaterial color={"green"} />
      </Box>
      <Box
        castShadow
        args={[4, 4, 4]}
        position={[-10, 2, 0]}
        userData={{ viewPos: [-6, 9, -5] }}
        onClick={(e) => {
          e.stopPropagation();
          if (clicked === e.object) {
            setClicked(null);
          } else {
            setClicked(e.object);
          }
        }}
        onPointerMissed={() => {
          setClicked(null);
        }}
      >
        <meshStandardMaterial color={"blue"} />
      </Box>
    </>
  );
};

export default Scene;

/* Q&A */
/* 

Q: How does the animation actually work? When does it know to start and stop?
A: In our useFrame() we are always animating towards the target position. When we update our target
   the useFrame() starts animating towards the new value.

*/
