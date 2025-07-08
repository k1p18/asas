// export const estimateWeight = ({
//   volumeCm3,
//   size,
//   infill = 0.2,
//   density = 1.24,        // <- dynamic: pass from selected material
//   wallLineWidth = 0.4,
//   wallCount = 2,
//   topBottomLayers = 5,
//   layerHeight = 0.2,
// }: {
//   volumeCm3: number;
//   size: { x: number; y: number; z: number };
//   infill?: number;
//   density?: number;       // <- dynamic density here
//   wallLineWidth?: number;
//   wallCount?: number;
//   topBottomLayers?: number;
//   layerHeight?: number;
// }): number => {
//   // Convert size from mm to cm (assuming size is in mm)
//   const x = size.x / 10;
//   const y = size.y / 10;
//   const z = size.z / 10;

//   const wallThicknessCm = (wallLineWidth * wallCount) / 10;
//   const topBottomThicknessCm = (layerHeight * topBottomLayers) / 10;

//   const topBottomVolume = x * y * topBottomThicknessCm * 2;
//   const sideWallArea = 2 * (x + y) * z;
//   const sideWallVolume = sideWallArea * wallThicknessCm;

//   const shellVolume = topBottomVolume + sideWallVolume;
//   const infillVolume = Math.max(volumeCm3 - shellVolume, 0) * infill;

//   const totalVolume = shellVolume + infillVolume;
//   const weightGrams = totalVolume * density;

//   return Number(weightGrams.toFixed(3));
// };


// components/utils/estimateWeight.ts
import * as THREE from "three";
import { PRINTING_CONSTANTS } from "@/app/config";

export const estimateWeight = ({
  volumeCm3,
  size,
  infill,
  density,
  wallLineWidth = PRINTING_CONSTANTS.WALL_LINE_WIDTH,
  wallCount = PRINTING_CONSTANTS.WALL_COUNT,
  topBottomLayers = PRINTING_CONSTANTS.TOP_BOTTOM_LAYERS,
  layerHeight = PRINTING_CONSTANTS.LAYER_HEIGHT,
}: {
  volumeCm3: number;
  size: THREE.Vector3;
  infill: number;
  density: number;
  wallLineWidth?: number;
  wallCount?: number;
  topBottomLayers?: number;
  layerHeight?: number;
}): number => {
  if (volumeCm3 < 0) {
    console.warn("Invalid volumeCm3, returning 0");
    return 0;
  }

  // Convert size from mm to cm
  const x = size.x / 10;
  const y = size.y / 10;
  const z = size.z / 10;

  const wallThicknessCm = (wallLineWidth * wallCount) / 10;
  const topBottomThicknessCm = (layerHeight * topBottomLayers) / 10;

  const topBottomVolume = x * y * topBottomThicknessCm * 2;
  const sideWallArea = 2 * (x + y) * z;
  const sideWallVolume = sideWallArea * wallThicknessCm;

  const shellVolume = topBottomVolume + sideWallVolume;
  const infillVolume = Math.max(volumeCm3 - shellVolume, 0) * infill;

  const totalVolume = shellVolume + infillVolume;
  const weightGrams = totalVolume * density;

  return Number(weightGrams.toFixed(2)); // Match metrics.weight format (X.XX g)
};