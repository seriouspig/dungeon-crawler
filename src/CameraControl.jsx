
import { useFrame } from "@react-three/fiber";
import state from "./state";

const CameraControl = ({}) => {
  useFrame(({ camera, scene }) => {
    if (state.shouldUpdate) {
      camera.position.lerp(state.cameraPos, 0.1);
    }
  });
  return null;
};

export default CameraControl;
