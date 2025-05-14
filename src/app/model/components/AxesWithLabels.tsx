import React, { useMemo } from "react";
import { Line, Html } from "@react-three/drei";
import * as THREE from "three";

// Props for customizable axis lengths and line width
interface AxesProps {
  xLength?: number;
  yLength?: number;
  zLength?: number;
  lineWidth?: number;
}

const Axes: React.FC<AxesProps> = ({
  xLength = 140,
  yLength = 100,
  zLength = 100,
  lineWidth = 12,
}) => {
  // Memoized points for each axis
  const xPoints = useMemo(
    () => [new THREE.Vector3(0, 0, 0), new THREE.Vector3(xLength, 0, 0)],
    [xLength]
  );
  const yPoints = useMemo(
    () => [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, yLength, 0)],
    [yLength]
  );
  const zPoints = useMemo(
    () => [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, zLength)],
    [zLength]
  );

  // Memoized colors for consistency
  const colors = useMemo(
    () => ({ x: "red", y: "green", z: "blue" }),
    []
  );

  return (
    <group>
      {/* X Axis */}
      <Line points={xPoints} color={colors.x} lineWidth={lineWidth} />
      <Html position={[xLength + 5, 0, 0]}>
        <div style={{ color: colors.x, fontWeight: "bold", fontSize: "16px" }}>
          X
        </div>
      </Html>

      {/* Y Axis */}
      <Line points={yPoints} color={colors.y} lineWidth={lineWidth} />
      <Html position={[0, yLength + 5, 0]}>
        <div style={{ color: colors.y, fontWeight: "bold", fontSize: "16px" }}>
          Y
        </div>
      </Html>

      {/* Z Axis */}
      <Line points={zPoints} color={colors.z} lineWidth={lineWidth} />
      <Html position={[0, 0, zLength + 5]}>
        <div style={{ color: colors.z, fontWeight: "bold", fontSize: "16px" }}>
          Z
        </div>
      </Html>
    </group>
  );
};

export default Axes;