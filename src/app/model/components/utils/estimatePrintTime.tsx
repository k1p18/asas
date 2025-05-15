import * as THREE from "three";

export const estimatePrintTime = (
  object: THREE.Object3D,
  infill: number
): number => {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());

  const dimensions = [
    { axis: "x", value: size.x },
    { axis: "y", value: size.y },
    { axis: "z", value: size.z },
  ];

  dimensions.sort((a, b) => b.value - a.value);

  // Largest dimension is height
  const heightAxis = dimensions[0].axis;
  const heightMM = dimensions[0].value;

  // The other two axes are width & depth
  const widthAxis = dimensions[1].axis;
  const depthAxis = dimensions[2].axis;

  // Map axes to their sizes
  const axisMap: Record<string, number> = {
    x: size.x,
    y: size.y,
    z: size.z,
  };

  const width = axisMap[widthAxis];
  const depth = axisMap[depthAxis];

  const layerHeight = 0.2;
  const printSpeed = 50;
  const perimeterSpeed = 20;
  const travelSpeed = 100;
  // const infill = 0.2;
  const layerChangeTime = 1.0;

  const numLayers = Math.ceil(heightMM / layerHeight);

  const perimeterLength = 2 * (size.x + size.y) * 2;
  const infillLength = (size.x * size.y * infill) / (layerHeight * 2);
  const travelLength = perimeterLength * 0.5;

  const timePerLayer =
    perimeterLength / perimeterSpeed +
    infillLength / printSpeed +
    travelLength / travelSpeed;
  let totalTime = (timePerLayer + layerChangeTime) * numLayers;
  totalTime += numLayers * 0.2 * (perimeterLength / printSpeed) * 0.5;
  totalTime += 120; // overhead

  return totalTime;
};

export const formatTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hrs.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};
